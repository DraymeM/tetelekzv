import { useState, useEffect, useRef } from "react";

export function useSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const utteranceQueue = useRef<SpeechSynthesisUtterance[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const isMountedRef = useRef(true);
  const selectedVoiceRef = useRef<string | undefined>(undefined);

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  // Load voices on mount
  useEffect(() => {
    isMountedRef.current = true;

    if (!isSupported) {
      setIsLoadingVoices(false);
      setError("Speech synthesis is not supported by your browser.");
      return;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synthRef.current!.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setIsLoadingVoices(false);
        setError(null);
      } else {
        setTimeout(loadVoices, 1500);
      }
    };

    setIsLoadingVoices(true);
    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;

    return () => {
      isMountedRef.current = false;
      stop();
      if (synthRef.current) synthRef.current.onvoiceschanged = null;
    };
  }, [isSupported]);

  // Split text into chunks (~300 chars, breaking at spaces)
  const splitIntoChunks = (text: string, maxLength: number) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      let end = start + maxLength;
      if (end < text.length) {
        while (end > start && text[end] !== " ") end--;
        if (end === start) end = start + maxLength; // Fallback if no space
      } else {
        end = text.length;
      }
      const chunk = text.slice(start, end).trim();
      if (chunk.length > 0) chunks.push(chunk);
      start = end;
      while (start < text.length && text[start] === " ") start++;
    }
    return chunks;
  };

  // Create a speech utterance
  const createUtterance = (
    text: string,
    voiceName?: string,
    rate = 1,
    pitch = 1,
    volume = 1
  ) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voiceName
      ? voices.find((v) => v.name === voiceName)
      : voices[0];
    if (voice) utterance.voice = voice;
    utterance.rate = Math.min(Math.max(rate, 0.1), 10);
    utterance.pitch = Math.min(Math.max(pitch, 0), 2);
    utterance.volume = Math.min(Math.max(volume, 0), 1);

    utterance.onerror = (event) => {
      setError(`Speech Error: ${event.error}`);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    return utterance;
  };

  // Speak all chunks
  const speak = (
    text: string,
    voiceName?: string,
    rate = 1,
    pitch = 1,
    volume = 1,
    startIndex = 0
  ) => {
    if (!text || !isSupported || !synthRef.current || isLoadingVoices) {
      setError("Cannot speak: Voices are still loading or not supported.");
      return;
    }

    stop();

    selectedVoiceRef.current = voiceName;
    const cleanText = text.trim().replace(/\s+/g, " ");
    const chunksArray = splitIntoChunks(cleanText, 300);
    setChunks(chunksArray);
    setCurrentChunkIndex(startIndex);

    const utterances = chunksArray.slice(startIndex).map((chunk, index) => {
      const utterance = createUtterance(chunk, voiceName, rate, pitch, volume);
      utterance.onstart = () => {
        setCurrentChunkIndex(startIndex + index);
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        if (index === chunksArray.length - startIndex - 1) {
          setIsSpeaking(false);
          setIsPaused(false);
          setCurrentChunkIndex(chunksArray.length - 1);
        }
      };
      return utterance;
    });

    utteranceQueue.current = utterances;
    utterances.forEach((utterance) => synthRef.current!.speak(utterance));
  };

  // Navigate to a specific chunk
  const goToChunk = (index: number) => {
    if (index < 0 || index >= chunks.length || !synthRef.current) return;
    stop();
    speak(chunks.join(" "), selectedVoiceRef.current, 1, 1, 1, index);
  };

  // Stop speech
  const stop = () => {
    if (!isSupported || !synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setError(null);
    utteranceQueue.current = [];
  };

  // Pause and resume
  const pause = () => {
    if (!isSupported || !synthRef.current || !isSpeaking || isPaused) return;
    synthRef.current.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!isSupported || !synthRef.current || !isSpeaking || !isPaused) return;
    synthRef.current.resume();
    setIsPaused(false);
  };

  return {
    voices,
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    isSupported,
    isLoadingVoices,
    error,
    chunks,
    currentChunkIndex,
    goToChunk,
  };
}
