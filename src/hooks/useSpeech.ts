// useSpeech.ts
import { useState, useEffect, useRef } from "react";

export function useSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const utteranceQueue = useRef<SpeechSynthesisUtterance[]>([]);
  const currentUtteranceIndex = useRef(0);
  const isMountedRef = useRef(true);
  const browser = useRef<string>("unknown");
  const isMobile = useRef<boolean>(false);
  const pendingParams = useRef<{ rate: number; pitch: number; volume: number }>(
    {
      rate: 1,
      pitch: 1,
      volume: 1,
    }
  );
  const remainingText = useRef<string>("");

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    isMobile.current =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    if (userAgent.includes("chrome")) browser.current = "chrome";
    else if (userAgent.includes("firefox")) browser.current = "firefox";
    else if (userAgent.includes("safari")) browser.current = "safari";
    else if (userAgent.includes("edge")) browser.current = "edge";
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    if (!isSupported) {
      setIsLoadingVoices(false);
      setError("Speech synthesis is not supported by your browser.");
      return;
    }

    synthRef.current = window.speechSynthesis;

    const loadVoices = async () => {
      if (!synthRef.current) return;

      const maxRetries = 5;
      let attempts = 0;

      const attemptLoadVoices = () => {
        const availableVoices = synthRef.current!.getVoices();
        if (availableVoices.length > 0) {
          if (isMountedRef.current) {
            setVoices(availableVoices);
            setIsLoadingVoices(false);
            setError(null);
          }
        } else if (attempts < maxRetries) {
          attempts++;
          setTimeout(attemptLoadVoices, 1500);
        } else {
          if (isMountedRef.current) {
            setIsLoadingVoices(false);
            setError("Failed to load voices after multiple attempts.");
          }
        }
      };

      setIsLoadingVoices(true);
      attemptLoadVoices();
      synthRef.current.onvoiceschanged = attemptLoadVoices;
    };

    loadVoices();

    return () => {
      isMountedRef.current = false;
      stop();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  const createUtterance = (
    text: string,
    voiceName?: string,
    rate = 1,
    pitch = 1,
    volume = 1
  ) => {
    const utterance = new SpeechSynthesisUtterance(text);
    let voice = voiceName ? voices.find((v) => v.name === voiceName) : null;
    if (!voice) {
      voice = isMobile.current
        ? voices.find((v) => v.localService) || voices[0]
        : voices[0];
    }
    if (voice) utterance.voice = voice;
    utterance.rate = Math.min(Math.max(rate, 0.1), 10);
    utterance.pitch = Math.min(Math.max(pitch, 0), 2);
    utterance.volume = Math.min(Math.max(volume, 0), 1);

    utterance.onstart = () => {
      if (isMountedRef.current) {
        setIsSpeaking(true);
        setIsPaused(false);
        setError(null);
      }
    };

    utterance.onend = () => {
      if (isMountedRef.current) {
        currentUtteranceIndex.current++;
        if (currentUtteranceIndex.current < utteranceQueue.current.length) {
          synthRef.current!.speak(
            utteranceQueue.current[currentUtteranceIndex.current]
          );
        } else if (remainingText.current) {
          const nextChunk = remainingText.current.slice(0, 300); // Adjusted to match speak
          remainingText.current = remainingText.current.slice(300);
          utteranceQueue.current = [
            createUtterance(
              nextChunk,
              voiceName,
              pendingParams.current.rate,
              pendingParams.current.pitch,
              pendingParams.current.volume
            ),
          ];
          currentUtteranceIndex.current = 0;
          if (nextChunk) {
            synthRef.current!.speak(utteranceQueue.current[0]);
          } else {
            setIsSpeaking(false);
            setIsPaused(false);
            currentUtteranceIndex.current = 0;
            utteranceQueue.current = [];
            remainingText.current = "";
          }
        } else {
          setIsSpeaking(false);
          setIsPaused(false);
          currentUtteranceIndex.current = 0;
          utteranceQueue.current = [];
          remainingText.current = "";
        }
      }
    };

    utterance.onerror = (event) => {
      const errorMessage = `Speech Error: ${event.error}`;
      if (isMountedRef.current) {
        setIsSpeaking(false);
        setIsPaused(false);
        setError(errorMessage);
        if (
          voice &&
          !voice.localService &&
          voices.find((v) => v.localService)
        ) {
          speak(
            text,
            voices.find((v) => v.localService)?.name,
            rate,
            pitch,
            volume
          );
        }
      }
    };

    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    return utterance;
  };

  const speak = (
    text: string,
    voiceName?: string,
    rate = 1,
    pitch = 1,
    volume = 1
  ) => {
    if (!text || !isSupported || !synthRef.current || isLoadingVoices) {
      setError("Cannot speak: Voices are still loading or not supported.");
      return;
    }

    stop();

    pendingParams.current = { rate, pitch, volume };

    // Clean and chunk text
    const cleanText = text.trim().replace(/\s+/g, " ");
    const sentences = cleanText.match(/\S.{0,298}\s/g) || [cleanText]; // Stop at whitespace

    // Initialize queue with first chunk
    utteranceQueue.current = [
      createUtterance(sentences[0] || "", voiceName, rate, pitch, volume),
    ];
    remainingText.current = sentences.slice(1).join("");

    currentUtteranceIndex.current = 0;
    synthRef.current.cancel();
    if (utteranceQueue.current.length > 0) {
      synthRef.current.speak(utteranceQueue.current[0]);
    }
  };

  const updateParams = (params: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    pendingParams.current = { ...pendingParams.current, ...params };

    for (
      let i = currentUtteranceIndex.current;
      i < utteranceQueue.current.length;
      i++
    ) {
      const utterance = utteranceQueue.current[i];
      if (params.rate)
        utterance.rate = Math.min(Math.max(params.rate, 0.1), 10);
      if (params.pitch)
        utterance.pitch = Math.min(Math.max(params.pitch, 0), 2);
      if (params.volume)
        utterance.volume = Math.min(Math.max(params.volume, 0), 1);
    }

    if (
      isSpeaking &&
      !isPaused &&
      currentUtteranceIndex.current < utteranceQueue.current.length
    ) {
      synthRef.current!.cancel();
      const currentText =
        utteranceQueue.current[currentUtteranceIndex.current]?.text || "";
      utteranceQueue.current[currentUtteranceIndex.current] = createUtterance(
        currentText,
        utteranceQueue.current[currentUtteranceIndex.current]?.voice?.name,
        pendingParams.current.rate,
        pendingParams.current.pitch,
        pendingParams.current.volume
      );
      synthRef.current!.speak(
        utteranceQueue.current[currentUtteranceIndex.current]
      );
    }
  };

  const pause = () => {
    if (!isSupported || !synthRef.current || !isSpeaking || isPaused) return;
    synthRef.current.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!isSupported || !synthRef.current || !isSpeaking || !isPaused) return;
    if (browser.current === "safari" || isMobile.current) {
      if (currentUtteranceIndex.current < utteranceQueue.current.length) {
        synthRef.current.cancel();
        synthRef.current.speak(
          utteranceQueue.current[currentUtteranceIndex.current]
        );
      }
    } else {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    if (!isSupported || !synthRef.current) return;
    synthRef.current.cancel();
    if (isMountedRef.current) {
      setIsSpeaking(false);
      setIsPaused(false);
      setError(null);
      utteranceQueue.current = [];
      currentUtteranceIndex.current = 0;
      remainingText.current = "";
    }
  };

  return {
    voices,
    speak,
    pause,
    resume,
    stop,
    updateParams,
    isSpeaking,
    isPaused,
    isSupported,
    isLoadingVoices,
    error,
  };
}
