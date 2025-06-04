// SpeechController.tsx
import React, { useState, useEffect, lazy, Suspense } from "react";
import { Menu } from "@headlessui/react";
import { FaChevronDown, FaSpinner, FaStop } from "react-icons/fa";
import { useSpeech } from "../../hooks/useSpeech";

const PlayPauseControls = lazy(() => import("./speech/PlayPauseControls"));
const VoiceSelector = lazy(() => import("./speech/VoiceSelector"));
const SpeechSliders = lazy(() => import("./speech/SpeechSliders"));

interface SpeechControllerProps {
  text: string;
  className?: string;
}

const SpeechController: React.FC<SpeechControllerProps> = ({
  text,
  className,
}) => {
  const {
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
  } = useSpeech();
  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (voices.length > 0 && !selectedVoice && !isLoadingVoices) {
      const defaultVoice = voices.find((v) => v.localService) || voices[0];
      setSelectedVoice(defaultVoice?.name);
    }
  }, [voices, selectedVoice, isLoadingVoices]);

  useEffect(() => () => stop(), []);

  const handlePlayPause = () => {
    if (!text || voices.length === 0 || isLoadingVoices) return;
    isSpeaking
      ? isPaused
        ? resume()
        : pause()
      : speak(text, selectedVoice, rate, pitch, volume);
  };

  const handleVoiceChange = (voiceName?: string) => {
    setSelectedVoice(voiceName);
    setDropdownOpen(false);
    if (isSpeaking) {
      stop();
      speak(text, voiceName, rate, pitch, volume); // Restart with new voice
    }
  };

  const handleSliderChange = (
    type: "rate" | "pitch" | "volume",
    value: number
  ) => {
    if (type === "rate") setRate(value);
    if (type === "pitch") setPitch(value);
    if (type === "volume") setVolume(value);
    updateParams({ [type]: value }); // Update params without stopping
  };

  return (
    <Menu
      as="div"
      className={`relative inline-block text-left ${className ?? ""}`}
    >
      {({ open }) => (
        <>
          <div className="flex space-x-0">
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin text-primary text-3xl" />
                </div>
              }
            >
              <PlayPauseControls
                isSpeaking={isSpeaking}
                isPaused={isPaused}
                hasVoices={voices.length > 0 && !isLoadingVoices}
                onClick={handlePlayPause}
              />
            </Suspense>
            <Menu.Button
              className="inline-flex items-center px-2 py-2.5 bg-blue-600 border-l-2 border-blue-800 hover:cursor-pointer rounded-r-md text-sm font-medium text-white hover:bg-blue-700"
              aria-label="Felolvasási Beállítások"
              title="Felolvasási Beállítások"
              disabled={isLoadingVoices || !isSupported}
            >
              <FaChevronDown
                size={16}
                className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
              />
            </Menu.Button>
          </div>

          <Menu.Items className="absolute right-0 mt-2 w-64 bg-secondary border border-border rounded-md shadow-lg p-4 space-y-4 max-h-[400px] overflow-auto z-50">
            <Suspense
              fallback={
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin text-primary min-h-[300px] max-w-[50px] text-4xl" />
                </div>
              }
            >
              {error && (
                <div className="text-red-600 text-sm mb-2">{error}</div>
              )}
              {isLoadingVoices && (
                <div className="text-gray-600 text-sm mb-2">
                  Loading voices...
                </div>
              )}
              <VoiceSelector
                voices={voices}
                selectedVoice={selectedVoice}
                isDropdownOpen={isDropdownOpen}
                setDropdownOpen={setDropdownOpen}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleVoiceChange={handleVoiceChange}
              />
              <SpeechSliders
                rate={rate}
                pitch={pitch}
                volume={volume}
                onChange={handleSliderChange}
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={stop}
                  disabled={!isSpeaking}
                  className={`inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition ${
                    !isSpeaking ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FaStop />
                  <span className="ml-2">Stop</span>
                </button>
              </div>
            </Suspense>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};

export default SpeechController;
