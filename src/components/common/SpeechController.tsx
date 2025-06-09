import React, { useState, useEffect, lazy, Suspense } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  FaCog,
  FaSpinner,
  FaPause,
  FaPlay,
  FaStop,
  FaTimes,
} from "react-icons/fa";
import { MdVolumeUp } from "react-icons/md";
import { IoMdSkipBackward, IoMdSkipForward } from "react-icons/io";
import { useSpeech } from "../../hooks/useSpeech";

const VoiceSelector = lazy(() => import("./speech/VoiceSelector"));
const SpeechSliders = lazy(() => import("./speech/SpeechSliders"));

interface SpeechControllerProps {
  text: string;
  className?: string;
}

// Helpers
const estimateDuration = (text: string, rate: number) => {
  const words = text.trim().split(/\s+/).length;
  const seconds = words / 3 / rate;
  return seconds;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

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
    isSpeaking,
    isPaused,
    isSupported,
    isLoadingVoices,
    error,
    chunks,
    currentChunkIndex,
    goToChunk,
  } = useSpeech();

  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasStartedSpeaking, setHasStartedSpeaking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isLoadingVoices || voices.length === 0) return;

    const storedVoice = localStorage.getItem("selectedVoice");
    if (storedVoice && voices.some((v) => v.name === storedVoice)) {
      setSelectedVoice(storedVoice);
    } else {
      const defaultVoice = voices.find((v) => v.localService) || voices[0];
      setSelectedVoice(defaultVoice?.name);
      if (storedVoice && storedVoice !== defaultVoice?.name) {
        // Optionally notify user if stored voice wasn't found
        console.warn(`Stored voice "${storedVoice}" not found, using default.`);
      }
    }
  }, [voices, isLoadingVoices]);

  // Clean up on unmount
  useEffect(() => () => stop(), []);

  // Reset state when speech ends naturally
  useEffect(() => {
    if (
      !isSpeaking &&
      !isPaused &&
      hasStartedSpeaking &&
      currentChunkIndex >= chunks.length - 1
    ) {
      setHasStartedSpeaking(false);
    }
  }, [
    isSpeaking,
    isPaused,
    hasStartedSpeaking,
    currentChunkIndex,
    chunks.length,
  ]);

  const handlePlayPause = () => {
    if (!text || voices.length === 0 || isLoadingVoices) return;
    if (isSpeaking) {
      isPaused ? resume() : pause();
    } else {
      speak(text, selectedVoice, rate, pitch, volume);
      setHasStartedSpeaking(true);
    }
  };

  const handleStop = () => {
    stop();
    setHasStartedSpeaking(false);
  };

  const handleVoiceChange = (voiceName?: string) => {
    setSelectedVoice(voiceName);
    // Save to localStorage
    if (voiceName) {
      localStorage.setItem("selectedVoice", voiceName);
    } else {
      localStorage.removeItem("selectedVoice");
    }
    if (isSpeaking) {
      stop();
      speak(text, voiceName, rate, pitch, volume, currentChunkIndex);
      setHasStartedSpeaking(true);
    }
  };

  const handleSliderChange = (
    type: "rate" | "pitch" | "volume",
    value: number
  ) => {
    if (type === "rate") setRate(value);
    if (type === "pitch") setPitch(value);
    if (type === "volume") setVolume(value);
    if (isSpeaking) {
      stop();
      speak(text, selectedVoice, rate, pitch, volume, currentChunkIndex);
      setHasStartedSpeaking(true);
    }
  };

  const totalChunks = chunks.length;

  const elapsed = estimateDuration(
    chunks.slice(0, currentChunkIndex).join(" "),
    rate
  );
  const total = estimateDuration(text, rate);

  const handleSeek = (clientX: number, target: HTMLDivElement) => {
    const rect = target.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
    const targetIndex = Math.floor(ratio * totalChunks);
    goToChunk(targetIndex);
    setHasStartedSpeaking(true);
  };

  // Progress bar width: 100% if speech has ended
  const progressWidth =
    !isSpeaking && currentChunkIndex >= totalChunks - 1
      ? 100
      : (currentChunkIndex / (totalChunks || 1)) * 100;

  return (
    <div className={`relative ${className ?? ""}`}>
      {!isSpeaking && !hasStartedSpeaking && (
        <button
          onClick={handlePlayPause}
          disabled={isLoadingVoices || !isSupported || voices.length === 0}
          className="inline-flex items-center py-2.5 px-3 hover:cursor-pointer bg-blue-600 border-blue-500 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Start Speech"
          title="Start Speech"
        >
          <MdVolumeUp size={18} />
        </button>
      )}

      {(isSpeaking || hasStartedSpeaking) && (
        <div className="fixed bottom-0 left-0 h-13 md:h-max md:left-33 w-[100dvw] md:w-[calc(100vw-8.6rem)] bg-secondary border-t-border py-2 flex justify-center md:gap-10 gap-3 items-center z-50 shadow-lg">
          {/* Progress Bar with Seek */}
          <div
            className="absolute top-0 left-2 md:w-[98%] w-[95%] mr-10 h-1 cursor-pointer bg-border rounded"
            onClick={(e) => handleSeek(e.clientX, e.currentTarget)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseMove={(e) => {
              if (isDragging) handleSeek(e.clientX, e.currentTarget);
            }}
          >
            <div
              className="h-1 bg-primary transition-all duration-300"
              style={{
                width: `${progressWidth}%`,
              }}
            />
            <div
              className="absolute top-[-4px] -translate-x-1/2 w-3 h-3 rounded-full bg-primary text-sm border border-border shadow"
              style={{
                left: `${progressWidth}%`,
              }}
            />
          </div>

          {/* Time Info */}
          <span className="absolute top-1 text-foreground left-2 md:text-sm text-[11px] font-mono">
            {formatTime(elapsed)} / {formatTime(total)}
          </span>

          {/* Stop */}
          <button
            onClick={handleStop}
            className="text-foreground hover:cursor-pointer"
            aria-label="Stop"
            title="Stop"
          >
            <FaStop size={18} />
          </button>

          {/* Previous Chunk */}
          <button
            onClick={() => {
              goToChunk(currentChunkIndex - 1);
              setHasStartedSpeaking(true);
            }}
            disabled={currentChunkIndex === 0}
            className="text-foreground hover:cursor-pointer disabled:opacity-50"
            aria-label="Previous Chunk"
            title="Previous Chunk"
          >
            <IoMdSkipBackward size={18} />
          </button>

          {/* Play / Pause */}
          <button
            onClick={handlePlayPause}
            className="text-white bg-teal-600 rounded-full p-3 mt-1 hover:cursor-pointer hover:bg-teal-700"
            aria-label={isSpeaking && !isPaused ? "Pause" : "Play"}
            title={isSpeaking && !isPaused ? "Pause" : "Play"}
          >
            {isSpeaking && !isPaused ? (
              <FaPause size={18} />
            ) : (
              <FaPlay size={18} />
            )}
          </button>

          {/* Next Chunk */}
          <button
            onClick={() => {
              goToChunk(currentChunkIndex + 1);
              setHasStartedSpeaking(true);
            }}
            disabled={currentChunkIndex >= totalChunks - 1}
            className="text-foreground hover:cursor-pointer disabled:opacity-50"
            aria-label="Next Chunk"
            title="Next Chunk"
          >
            <IoMdSkipForward size={18} />
          </button>

          {/* Settings Menu */}
          <Menu as="div" className="relative">
            <Menu.Button
              className="text-foreground focus:outline-none hover:cursor-pointer mt-1 transition-colors duration-200"
              aria-label="Reading Settings"
              title="Reading Settings"
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

            <Menu.Items className="absolute right-1/2 bottom-7 mb-2 w-64 bg-secondary border border-border rounded-md shadow-lg p-4 space-y-4 max-h-[400px] overflow-auto z-50">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin text-primary min-h-[310px] max-w-[50px] text-4xl" />
                  </div>
                }
              >
                {error && (
                  <div className="text-red-600 text-sm mb-2">{error}</div>
                )}
                {isLoadingVoices && (
                  <div className="text-muted-foreground text-sm mb-2">
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
                  isLoadingVoices={isLoadingVoices} // Pass isLoadingVoices
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
      )}
    </div>
  );
};

export default SpeechController;
