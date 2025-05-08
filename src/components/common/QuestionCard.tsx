import { Link } from "@tanstack/react-router";
import { FaChevronRight } from "react-icons/fa";

interface QuestionsCardProps {
  id: number;
  question: string;
  onClick?: (id: number) => void;
}

function QuestionsCard({ id, question }: QuestionsCardProps) {
  return (
    <div className="p-4 shadow-md rounded-md transition duration-300 border-2 transform text-foreground border-transparent bg-secondary hover:border-[var(--border)]">
      <Link
        to={`/mquestions/$id`}
        params={{ id: id.toString() }}
        className="flex justify-between items-center w-full h-full"
      >
        <div className="flex-1 pr-4 overflow-hidden">
          <h3 className="text-xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
            <span style={{ color: "var(--foreground)" }} className="font-bold">
              {id}.{" "}
            </span>
            {question}
          </h3>
        </div>
        <div className="flex items-center p-4 hover:cursor-pointer rounded-md h-full transition-colors bg-muted text-primary hover:shadow">
          <FaChevronRight size={20} />
        </div>
      </Link>
    </div>
  );
}

export default QuestionsCard;
