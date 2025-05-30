import React from "react";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  id: string;
  onExit: () => void;
  showNext: boolean;
  handleNext: () => void;
};

const BottomControls: React.FC<Props> = ({
  id,
  onExit,
  showNext,
  handleNext,
}) => (
  <div id={id} className="flex gap-4 ">
    <button
      onClick={onExit}
      className="inline-flex items-center hover:cursor-pointer px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <FaArrowLeft className="mr-2" />
      Tételhez
    </button>

    {showNext && (
      <button
        onClick={handleNext}
        className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center hover:cursor-pointer"
      >
        <FaArrowLeft className="mr-2" style={{ transform: "rotate(180deg)" }} />
        Következő
      </button>
    )}
  </div>
);
export default BottomControls;
