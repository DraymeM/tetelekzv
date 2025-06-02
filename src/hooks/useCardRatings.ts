import { useState, useMemo } from "react";

export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export function useCardRatings(count: number) {
  const [ratings, setRatings] = useState<Map<number, Rating>>(new Map());

  const rateCard = (idx: number, rating: Rating) => {
    setRatings((prev) => {
      const next = new Map(prev);
      next.set(idx, rating);
      return next;
    });
  };

  const getRating = (idx: number): Rating | null =>
    ratings.has(idx) ? ratings.get(idx)! : null;

  const sortedIndexes = useMemo(() => {
    const indexes = Array.from({ length: count }, (_, i) => i);
    indexes.sort((a, b) => {
      const ra = ratings.get(a) ?? -1;
      const rb = ratings.get(b) ?? -1;
      return ra - rb;
    });
    return indexes;
  }, [ratings, count]);

  return {
    ratings: Object.fromEntries(ratings), // optional: expose plain object for compatibility
    rateCard,
    getRating,
    sortedIndexes,
  };
}
