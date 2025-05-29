import React, { useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { Transition } from "@headlessui/react";

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice?: string;
  isDropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleVoiceChange: (voiceName?: string) => void;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  voices,
  selectedVoice,
  isDropdownOpen,
  setDropdownOpen,
  searchTerm,
  setSearchTerm,
  handleVoiceChange,
}) => {
  const selectedRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isDropdownOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isDropdownOpen]);

  const filteredVoices = voices.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 text-foreground">
        Voice
      </label>
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="relative w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary"
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
      >
        <span className="truncate">
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
        <div className="absolute z-50 mt-1 w-full max-h-62 rounded-md border border-border bg-popover shadow-lg text-sm focus:outline-none flex flex-col">
          <div className="flex items-center border-b border-border rounded-t-md overflow-hidden text-md bg-background px-1 py-1">
            <button
              type="button"
              className="pr-3 pl-1 py-2 bg-background border-r border-border text-foreground"
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

          <ul role="listbox" className="overflow-auto max-h-[14rem]">
            <li
              role="option"
              aria-selected={!selectedVoice}
              onClick={() => handleVoiceChange(undefined)}
              className={`px-3 py-2 cursor-pointer select-none ${
                !selectedVoice ? "bg-muted text-foreground" : "hover:bg-muted"
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
                    isSelected ? "bg-muted text-foreground" : "hover:bg-muted"
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
  );
};

export default VoiceSelector;
