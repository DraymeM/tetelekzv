import { FaCheckCircle, FaClipboardList, FaTrophy } from "react-icons/fa";

interface ScoreboardProps {
  score: number;
  questionsAnswered: number;
  streak: number;
}

export default function Scoreboard({
  score,
  questionsAnswered,
  streak,
}: ScoreboardProps) {
  return (
    <div className="flex flex-row md:gap-6 gap-2 mb-6 text-muted-foreground text-sm justify-center">
      <div className="flex items-center md:gap-2 gap-1 bg-green-100/20 md:px-4 px-2 py-2 rounded-md shadow-sm">
        <FaCheckCircle className="text-green-500" aria-hidden="true" />
        <span className="text-foreground">
          Válaszok:{" "}
          <span className="font-semibold text-green-500">{score}</span>
        </span>
      </div>
      <div className="flex items-center md:gap-2 gap-1 bg-blue-100/20 md:px-4 px-2 py-2 rounded-md shadow-sm">
        <FaClipboardList className="text-blue-500" aria-hidden="true" />
        <span className="text-foreground">
          Kérdések:{" "}
          <span className="font-semibold text-blue-500">
            {questionsAnswered}
          </span>
        </span>
      </div>
      <div className="flex items-center md:gap-2 gap-1 bg-yellow-100/20 md:px-4 px-2 py-2 rounded-md shadow-sm">
        <FaTrophy className="text-yellow-500" aria-hidden="true" />
        <span className="text-foreground">
          Sorozat:{" "}
          <span className="font-semibold text-yellow-500">{streak}</span>
        </span>
      </div>
    </div>
  );
}
