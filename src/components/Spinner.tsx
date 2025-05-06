import { FaSpinner } from "react-icons/fa";
import type { FC } from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <FaSpinner className="animate-spin text-primary text-6xl" />
    </div>
  );
};

export default Spinner;
