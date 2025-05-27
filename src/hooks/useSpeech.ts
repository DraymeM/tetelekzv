import { useState, useEffect, useRef } from "react";

export function useSpeech() {
  const synth = window.speechSynthesis;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      let v = synth.getVoices();
      if (v.length > 0) {
        setVoices(v);
        resolve(v);
      } else {
        const interval = setInterval(() => {
          v = synth.getVoices();
          if (v.length > 0) {
            clearInterval(interval);
            setVoices(v);
            resolve(v);
          }
        }, 100);
      }
    });
  };

  useEffect(() => {
    loadVoices();

    if ("onvoiceschanged" in synth) {
      synth.onvoiceschanged = loadVoices;
    }

    return () => {
      if ("onvoiceschanged" in synth) {
        synth.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = (
    text: string,
    voiceName?: string,
    rate = 1,
    pitch = 1,
    volume = 1
  ) => {
    if (!text) return;

    // Cancel any ongoing speech first
    stop();

    const utterance = new SpeechSynthesisUtterance(text);

    if (voiceName) {
      const voice = voices.find((v) => v.name === voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const pause = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    synth.cancel();
    setIsSpeaking(false);
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
  };
}
