import React from "react";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  id: string;
  onExit: () => void;
  showNext: boolean;
  handleNext: () => void;
};

const BottomControls: React.FC<Props> = ({ id, showNext, handleNext }) => (
  <div id={id} className="flex ">
    {showNext && (
      <button
        onClick={handleNext}
        className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center hover:cursor-pointer"
        aria-label="Következő kártya"
        title="Következő kártya"
      >
        <FaArrowLeft className="mr-2" style={{ transform: "rotate(180deg)" }} />
        Következő
      </button>
    )}
  </div>
);
export default BottomControls;
