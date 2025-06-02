import { FaRedo } from "react-icons/fa";

interface ResetButtonProps {
  onClick: () => void;
}

export default function ResetButton({ onClick }: ResetButtonProps) {
  return (
    <button
      className="mt-4 px-6 py-3 rounded bg-red-600 hover:bg-red-700 text-white transition-all transform hover:cursor-pointer flex items-center gap-2"
      onClick={onClick}
      aria-label="Teszt újraindítása"
      title="Teszt újraindítása"
    >
      <FaRedo aria-hidden="true" />
      Újrakezdés
    </button>
  );
}
