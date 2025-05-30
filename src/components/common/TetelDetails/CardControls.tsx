import React from "react";
import { RATING_ICONS } from "./RatingIcons";
import type { Rating } from "@/hooks/useCardRatings";

type Props = {
  id: string;
  selectedIdx: number;
  rateCard: (idx: number, rating: Rating) => void;
  putBackToDeck: () => void;
  handleNext: () => void;
};

const CardControls: React.FC<Props> = ({
  id,
  selectedIdx,
  rateCard,
  putBackToDeck,
  handleNext,
}) => (
  <>
    <div id={id} className="flex gap-2 ">
      {RATING_ICONS.map(({ Icon, label, color }, i) => (
        <button
          key={i}
          onClick={() => {
            rateCard(selectedIdx, i as Rating);
            putBackToDeck();
            handleNext();
          }}
          className={`text-2xl ${color} bg-muted rounded-full p-2 hover:bg-muted/80 hover:cursor-pointer transition-transform`}
          title={label}
        >
          <Icon />
        </button>
      ))}
    </div>
  </>
);
export default CardControls;
