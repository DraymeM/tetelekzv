import React, { useState, useEffect, lazy, Suspense } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  FaCog,
  FaSpinner,
  FaTimes,
  FaPause,
  FaPlay,
  FaStop,
} from "react-icons/fa";
import { MdVolumeUp } from "react-icons/md";
import { useSpeech } from "../../hooks/useSpeech";

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
      speak(text, voiceName, rate, pitch, volume);
    }
  };

  const handleSliderChange = (
    type: "rate" | "pitch" | "volume",
    value: number
  ) => {
    if (type === "rate") setRate(value);
    if (type === "pitch") setPitch(value);
    if (type === "volume") setVolume(value);
    updateParams({ [type]: value });
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      {!isSpeaking && (
        <button
          onClick={handlePlayPause}
          disabled={isLoadingVoices || !isSupported || voices.length === 0}
          className="inline-flex items-center py-2.5 px-3 bg-blue-600 border-blue-500 hover:cursor-pointer rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Start Speech"
          title="Start Speech"
        >
          <MdVolumeUp size={18} />
        </button>
      )}

      <Transition
        show={isSpeaking}
        enter="transition transform ease-out duration-300"
        enterFrom="translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transition transform ease-in duration-200"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-full opacity-0"
      >
        <div className="fixed bottom-0 left-0 h-13 md:h-max md:left-33 w-[100dvw] md:w-[calc(100vw-8.25rem)] bg-secondary border-t-border border-t-2 py-2 flex justify-center gap-10 items-center z-50 shadow-lg">
          <button
            onClick={stop}
            className="text-foreground focus:outline-none hover:cursor-pointer transition-colors duration-200"
            aria-label="Stop"
            title="Stop"
          >
            <FaStop size={18} />
          </button>

          <button
            onClick={handlePlayPause}
            className="text-white focus:outline-none bg-teal-600 bottom-1 rounded-full p-3 hover:bg-teal-700 hover:cursor-pointer transition-colors duration-200"
            aria-label={isPaused ? "Resume" : "Pause"}
            title={isPaused ? "Resume" : "Pause"}
          >
            <Transition
              show
              appear
              enter="transition-opacity duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {isPaused ? <FaPlay size={18} /> : <FaPause size={18} />}
            </Transition>
          </button>

          <Menu as="div" className="relative">
            <Menu.Button
              className="text-foreground focus:outline-none hover:cursor-pointer transition-colors duration-200"
              aria-label="Felolvasási Beállítások"
              title="Felolvasási Beállítások"
              disabled={isLoadingVoices || !isSupported}
            >
              {({ open }) => (
                <Transition
                  show
                  appear
                  enter="transition-opacity duration-200"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {open ? <FaTimes size={18} /> : <FaCog size={18} />}
                </Transition>
              )}
            </Menu.Button>

            <Menu.Items className="absolute right-1/2 bottom-5 mb-2 w-64 bg-secondary border border-border rounded-md shadow-lg p-4 space-y-4 max-h-[400px] overflow-auto z-50">
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
              </Suspense>
            </Menu.Items>
          </Menu>
        </div>
      </Transition>
    </div>
  );
};

export default SpeechController;
