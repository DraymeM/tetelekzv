import { IoIosWarning } from "react-icons/io";

interface WarningCardProps {
  message: string;
}

const WarningCard: React.FC<WarningCardProps> = ({ message }) => (
  <div className="mb-6 p-3 bg-orange-500/10 border border-orange-500 text-orange-500 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
    <IoIosWarning size={20} />
    <span>{message}</span>
  </div>
);

export default WarningCard;
