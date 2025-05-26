import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

interface StackedCardsProps {
  count: number;
  maxCount: number;
}

const StackedCards: React.FC<StackedCardsProps> = ({ count, maxCount }) => {
  const percentage = Math.min((count / maxCount) * 100, 100);
  const maxVisibleCards = 10;

  const filledCardsCount = Math.min(
    Math.round((percentage / 100) * maxVisibleCards),
    maxVisibleCards
  );

  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    setVisibleCards(0);
    const interval = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev < maxVisibleCards) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* CountUp number above */}
      <CountUp
        start={0}
        end={count}
        duration={3}
        separator=" "
        className="text-2xl font-extrabold text-foreground"
      />

      {/* Cards below */}
      <div className="flex items-center space-x-[-12px]">
        {[...Array(maxVisibleCards)].map((_, i) => {
          const isVisible = i < visibleCards;
          const isFilled = i < filledCardsCount;

          return (
            <div
              key={i}
              className={`w-8 h-12 rounded shadow-md border border-border transition-colors duration-300
                ${isFilled ? "bg-primary" : "bg-muted"}
              `}
              style={{
                zIndex: i,
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0) skewY(-10deg)"
                  : "translateY(20px) skewY(-10deg)",
                transition: `opacity 0.1s ease, transform 0.3s ease`,
                transitionDelay: `${i * 100}ms`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StackedCards;
