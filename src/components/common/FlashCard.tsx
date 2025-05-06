import { useState, useEffect } from "react";
import { FaQuestionCircle, FaCheckCircle, FaSpinner } from "react-icons/fa";

interface FlashCardProps {
  question: string;
  answer: string;
}

export default function FlashCard({ question, answer }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setFlipped(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [question, answer]);

  const handleFlip = () => {
    setFlipped((f) => !f);
  };

  return (
    <div className="w-80 h-48 perspective" onClick={handleFlip}>
      <div
        className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front side */}
        <div className="absolute w-full h-full backface-hidden hover:cursor-pointer hover:border-border border-2 border-transparent bg-secondary rounded-md shadow-md p-4 flex flex-col justify-between">
          <div className="inline-flex items-center text-lg font-semibold bg-blue-800 p-2 rounded text-white">
            <FaQuestionCircle className="mr-2" />
            Kérdés
          </div>
          <div className="flex-grow flex items-center justify-center">
            {isLoading ? (
              <FaSpinner className="animate-spin text-blue-400 text-3xl" />
            ) : (
              <p className="text-foreground p-4 text-center overflow-auto">
                {question}
              </p>
            )}
          </div>
        </div>

        {/* Back side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 hover:cursor-pointer hover:border-border border-2 border-transparent bg-muted rounded-md shadow-md p-4 flex flex-col justify-between">
          <div className="inline-flex items-center text-lg font-semibold p-2 rounded bg-green-800 text-white">
            <FaCheckCircle className="mr-2" />
            Válasz
          </div>
          <div className="flex-grow flex items-center justify-center">
            {isLoading ? (
              <FaSpinner className="animate-spin text-blue-400 text-3xl" />
            ) : (
              <p className="text-foreground text-center mt-4 overflow-auto">
                {answer}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
