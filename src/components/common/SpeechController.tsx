import React, { useState, useEffect, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  FaStop,
  FaPause,
  FaPlay,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import { MdVolumeUp } from "react-icons/md";
import { useSpeech } from "../../hooks/useSpeech";

interface SpeechControllerProps {
  text: string;
  className?: string;
}

const SpeechController: React.FC<SpeechControllerProps> = ({
  text,
  className,
}) => {
  const { voices, speak, pause, resume, stop, isSpeaking, isPaused } =
    useSpeech();

  const [selectedVoice, setSelectedVoice] = useState<string | undefined>();
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      setSelectedVoice(voices[0].name);
    }
  }, [voices, selectedVoice]);

  useEffect(() => {
    if (isDropdownOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlayPause = () => {
    if (!text || voices.length === 0) return;

    if (isSpeaking) {
      isPaused ? resume() : pause();
    } else {
      speak(text, selectedVoice, rate, pitch, volume);
    }
  };

  const handleStop = () => {
    stop();
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

    if (isSpeaking) {
      stop();

      speak(
        text,
        selectedVoice,
        type === "rate" ? value : rate,
        type === "pitch" ? value : pitch,
        type === "volume" ? value : volume
      );
    }
  };

  const sliderStyle = {
    accentColor: "var(--primary)",
    width: "100%",
  };

  const filteredVoices = voices.filter((voice) =>
    voice.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Menu
      as="div"
      className={`relative inline-block text-left ${className ?? ""}`}
    >
      {({ open }) => (
        <>
          <div className="flex space-x-0">
            <button
              onClick={handlePlayPause}
              disabled={voices.length === 0}
              className="inline-flex items-center py-2.5 px-3 bg-blue-600 border-blue-500 rounded-l-md text-sm font-medium text-white hover:bg-blue-700 cursor-pointer focus:outline-none transition-colors"
              aria-label="Felolvasás"
              title="Felolvasás"
            >
              {isSpeaking ? (
                isPaused ? (
                  <FaPlay size={16} />
                ) : (
                  <FaPause size={16} />
                )
              ) : (
                <MdVolumeUp size={18} />
              )}
            </button>

            <Menu.Button
              className="inline-flex items-center px-2 py-2.5 bg-blue-600 border-l-2 border-blue-800 rounded-r-md text-sm font-medium text-white hover:bg-blue-700 cursor-pointer focus:outline-none transition-colors"
              aria-label="Felolvasási beállítások"
              title="Felolvasási beállítások"
            >
              <FaChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </Menu.Button>
          </div>

          <Menu.Items className="absolute right-0 mt-2 w-64 bg-secondary border border-border rounded-md shadow-lg focus:outline-none z-50 p-4 space-y-4 max-h-[400px] overflow-auto">
            <div className="relative">
              <label className="block text-sm font-medium mb-1 text-foreground">
                Voice
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="relative w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
              >
                <span className="block max-w-[calc(100%-1.5rem)] truncate">
                  {selectedVoice
                    ? voices.find((v) => v.name === selectedVoice)?.name
                    : "Default"}
                </span>
                <FaChevronDown
                  size={15}
                  className={`ml-2 transition-transform duration-300 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <Transition
                show={isDropdownOpen}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div className="absolute z-50 mt-1 w-full max-h-64 overflow-auto rounded-md border border-border bg-popover shadow-lg text-sm focus:outline-none">
                  <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
                    <button
                      type="button"
                      className="px-3 py-2 bg-background hover:bg-background/80 border-r border-border text-foreground"
                      aria-label="Search"
                    >
                      <FaSearch size={14} />
                    </button>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="flex-grow px-3 py-2 text-sm text-foreground bg-background focus:outline-none"
                    />
                  </div>

                  <ul role="listbox">
                    <li
                      role="option"
                      aria-selected={!selectedVoice}
                      onClick={() => handleVoiceChange(undefined)}
                      className={`px-3 py-2 cursor-pointer select-none ${
                        !selectedVoice
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      Default
                    </li>

                    {filteredVoices.map((voice) => {
                      const isSelected = selectedVoice === voice.name;
                      return (
                        <li
                          key={voice.name}
                          role="option"
                          ref={isSelected ? selectedRef : null}
                          aria-selected={isSelected}
                          onClick={() => handleVoiceChange(voice.name)}
                          className={`px-3 py-2 cursor-pointer select-none ${
                            isSelected
                              ? "bg-muted text-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {voice.name} ({voice.lang}){" "}
                          {voice.localService ? "[Offline]" : "[Online]"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Transition>
            </div>

            {/* Sliders */}
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Rate: {rate.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) =>
                  handleSliderChange("rate", parseFloat(e.target.value))
                }
                style={sliderStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Pitch: {pitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) =>
                  handleSliderChange("pitch", parseFloat(e.target.value))
                }
                style={sliderStyle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Volume: {volume.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) =>
                  handleSliderChange("volume", parseFloat(e.target.value))
                }
                style={sliderStyle}
              />
            </div>

            <div className="flex justify-between mt-2">
              <button
                onClick={handleStop}
                disabled={!isSpeaking}
                className={`inline-flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition ${
                  !isSpeaking ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FaStop />
                <span className="ml-2">Stop</span>
              </button>
            </div>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
};

export default SpeechController;
