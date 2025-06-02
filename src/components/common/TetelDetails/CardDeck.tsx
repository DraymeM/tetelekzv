import React from "react";
import { FaRegHandPointer } from "react-icons/fa";
import { RATING_ICONS } from "./RatingIcons";

type Props = {
  id: string;
  questions: { question: string; answer: string }[];
  sortedIndexes: number[];
  selectedIdx: number | null;
  focusedIdx: number | null;
  getRating: (idx: number) => number | null;
  setFocusedIdx: (idx: number) => void;
  setSelectedIdx: (idx: number) => void;
};

const CardDeck: React.FC<Props> = ({
  id,
  questions,
  sortedIndexes,
  selectedIdx,
  focusedIdx,
  getRating,
  setFocusedIdx,
  setSelectedIdx,
}) => {
  if (sortedIndexes.length === 0) {
    return (
      <div
        id={id}
        className="w-full md:max-w-[450px] bg-secondary border border-border rounded-md p-6 text-center text-foreground"
        aria-label="Nincsenek villámkártyák"
      >
        <p className="text-lg font-semibold">Nincsenek villámkártyák</p>
        <p className="text-sm text-secondary-foreground">
          Ehhez a tételhez nem tartoznak villámkártyák.
        </p>
      </div>
    );
  }

  return (
    <div
      id={id}
      className="w-full md:max-w-[450px] overflow-x-auto scrollbar-hide touch-pan-x"
    >
      <div className="flex flex-row items-center space-x-[-30px] px-2 py-6 select-none">
        {sortedIndexes.map((idx, i) => {
          const card = questions[idx];
          const isFocused = focusedIdx === idx;
          const isSelected = selectedIdx === idx;
          const rating = getRating(idx);
          const IconComponent =
            rating !== null ? RATING_ICONS[rating].Icon : null;
          const iconColor = rating !== null ? RATING_ICONS[rating].color : "";
          const half = sortedIndexes.length / 2;
          const translateXValue = i < half ? 8 : -8;

          return (
            <div
              key={card.question}
              onClick={() => {
                if (isFocused) setSelectedIdx(idx);
                else setFocusedIdx(idx);
              }}
              className={`relative w-48 h-32 bg-secondary border border-border rounded-md shadow-md flex items-center justify-center p-4
                text-center font-semibold text-foreground cursor-pointer transition-transform duration-300 ease-in-out
                ${isFocused ? "z-50 border-primary text-primary shadow-lg bg-muted" : ""}
                hover:z-50 hover:shadow-lg hover:border-primary hover:text-primary`}
              style={{
                transform: `skewY(-10deg) ${
                  isFocused
                    ? `translateX(${translateXValue}px) scale(1.2)`
                    : "scale(1)"
                }`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = `skewY(-10deg) translateX(${translateXValue}px) scale(1.15)`;
              }}
              onMouseLeave={(e) => {
                if (!isFocused) {
                  e.currentTarget.style.transform = "skewY(-10deg) scale(1)";
                }
              }}
              title={`Kártya ${idx + 1}`}
            >
              {IconComponent && (
                <div className={`absolute top-1 left-1 text-xl ${iconColor}`}>
                  <IconComponent />
                </div>
              )}

              <div className="relative text-lg font-bold">
                {idx + 1}
                {isFocused && (
                  <>
                    <FaRegHandPointer
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 text-primary text-xl ${
                        isSelected ? "rotate-180 animate-bounce" : ""
                      }`}
                    />
                    {!isSelected && (
                      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs text-primary font-semibold">
                        Katt megint
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardDeck;
