import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdVolumeUp } from "react-icons/md";

interface PlayPauseControlsProps {
  isSpeaking: boolean;
  isPaused: boolean;
  hasVoices: boolean;
  onClick: () => void;
}

const PlayPauseControls: React.FC<PlayPauseControlsProps> = ({
  isSpeaking,
  isPaused,
  hasVoices,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!hasVoices}
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
  );
};

export default PlayPauseControls;
