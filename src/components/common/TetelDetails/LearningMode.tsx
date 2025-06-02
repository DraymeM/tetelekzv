import { lazy, Suspense, useState } from "react";
import { useCardRatings } from "@/hooks/useCardRatings";
import { IoArrowRedoSharp } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa"; // for the tutorial button
import { tutorialSteps } from "../../../tutorials/CardGameTutorial";
import Spinner from "@/components/Spinner";
import PageTransition from "../PageTransition";
const FlashCard = lazy(() => import("../FlashCard"));
const CardDeck = lazy(() => import("./CardDeck"));
const CardControls = lazy(() => import("./CardControls"));
const BottomControls = lazy(() => import("./BottomControls"));
const Tutorial = lazy(() => import("../Tutorial"));

const LearningMode = ({
  questions,
  onExit,
}: {
  questions: { question: string; answer: string }[];
  onExit: () => void;
}) => {
  // Initialize selectedIdx and focusedIdx to 0 if questions exist, else null
  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    questions.length > 0 ? 0 : null
  );
  const [focusedIdx, setFocusedIdx] = useState<number | null>(
    questions.length > 0 ? 0 : null
  );
  const [showTutorial, setShowTutorial] = useState(false);

  const { rateCard, getRating, sortedIndexes } = useCardRatings(
    questions.length
  );

  const putBackToDeck = () => {
    setSelectedIdx(null);
    setFocusedIdx(null);
  };

  const handleNext = () => {
    const currentIdx = selectedIdx ?? -1;
    const nextIdx =
      sortedIndexes.find((i) => i > currentIdx) ??
      sortedIndexes.find((i) => i !== currentIdx) ??
      sortedIndexes[0];
    setSelectedIdx(nextIdx);
    setFocusedIdx(nextIdx);
  };

  return (
    <>
      <Suspense fallback={<Spinner />}>
        <PageTransition>
          <div className="flex flex-col items-center gap-6">
            <CardDeck
              id="card-deck"
              questions={questions}
              sortedIndexes={sortedIndexes}
              selectedIdx={selectedIdx}
              focusedIdx={focusedIdx}
              getRating={getRating}
              setFocusedIdx={setFocusedIdx}
              setSelectedIdx={setSelectedIdx}
            />

            {selectedIdx !== null && (
              <>
                <button
                  id="put-back-button"
                  onClick={putBackToDeck}
                  className="inline-flex hover:cursor-pointer items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
                  title="Vissza rak"
                >
                  <IoArrowRedoSharp
                    className="mr-2"
                    style={{ transform: "rotate(-90deg)" }}
                  />
                  Vissza rak
                </button>

                <FlashCard
                  id="active-card"
                  question={questions[selectedIdx].question}
                  answer={questions[selectedIdx].answer}
                />
                <CardControls
                  id="card-controls"
                  selectedIdx={selectedIdx}
                  rateCard={rateCard}
                  putBackToDeck={putBackToDeck}
                  handleNext={handleNext}
                />
              </>
            )}

            <BottomControls
              id="bottom-controls"
              onExit={onExit}
              showNext={selectedIdx !== null}
              handleNext={handleNext}
            />
          </div>
        </PageTransition>

        {/* Floating Tutorial Button */}
        <button
          className="fixed top-20 right-7 p-3 bg-blue-600 hover:cursor-pointer text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 z-50"
          onClick={() => setShowTutorial(true)}
          title="Segítség a használathoz"
        >
          <FaQuestion size={20} />
        </button>

        {/* Tutorial Overlay */}
        <Tutorial
          open={showTutorial}
          onClose={() => setShowTutorial(false)}
          steps={tutorialSteps}
        />
      </Suspense>
    </>
  );
};

export default LearningMode;
