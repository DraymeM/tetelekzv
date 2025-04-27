import { FaSpinner } from "react-icons/fa";
import type { FC } from "react";

interface SpinnerProps {
  className?: string;
}

const Spinner: FC<SpinnerProps> = ({
  className = "text-blue-400 text-3xl",
}) => {
  return <FaSpinner className={`animate-spin ${className}`} />;
};

export default Spinner;
