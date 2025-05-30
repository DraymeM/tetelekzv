import { useState, useEffect } from "react";

export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export function useCardRatings(count: number) {
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [sortedIndexes, setSortedIndexes] = useState<number[]>([]);

  useEffect(() => {
    const indexes = Array.from({ length: count }, (_, i) => i);
    indexes.sort((a, b) => {
      const ra = ratings[a] ?? -1;
      const rb = ratings[b] ?? -1;
      return ra - rb;
    });
    setSortedIndexes(indexes);
  }, [ratings, count]);

  const rateCard = (idx: number, rating: Rating) => {
    setRatings((prev) => ({ ...prev, [idx]: rating }));
  };

  const getRating = (idx: number): Rating | null =>
    ratings.hasOwnProperty(idx) ? ratings[idx] : null;

  return { ratings, rateCard, getRating, sortedIndexes };
}
