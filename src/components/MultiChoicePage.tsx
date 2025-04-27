import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSyncAlt, FaRegClock, FaCheck } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import Navbar from "./Navbar";
import { fetchMultiQuestionsAll } from "../api/repo";
import AnswerPicker from "../components/common/AnswerPicker";
import Spinner from "./Spinner.tsx";

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MultiChoicePage() {
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery<
    { question: string; answers: { text: string; isCorrect: boolean }[] }[]
  >({
    queryKey: ["multiQuestions"],
    queryFn: fetchMultiQuestionsAll,
  });

  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<
    { text: string; isCorrect: boolean }[]
  >([]);

  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  const pickRandom = () => {
    if (!questions || questions.length === 0) return;

    let availableIndices = questions.map((_, index) => index);

    if (currentIdx !== null && questions.length > 1) {
      availableIndices = availableIndices.filter((i) => i !== currentIdx);
    }

    const randomIdx =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];

    setCurrentIdx(randomIdx);
    setTimeLeft(timerDuration);

    const shuffled = shuffleArray(questions[randomIdx].answers);
    setShuffledAnswers(shuffled);
  };

  useEffect(() => {
    if (questions && currentIdx === null) {
      pickRandom();
    }
  }, [questions]);

  useEffect(() => {
    if (!timerEnabled || currentIdx === null) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          pickRandom();
          return timerDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, currentIdx, timerDuration]);

  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );
  if (error instanceof Error)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const currentQuestion =
    currentIdx !== null ? (questions ?? [])[currentIdx] : null;

  const handleAnswerPick = (isCorrect: boolean) => {};

  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-3">Felelet Választás</h1>
        <p className="mb-6 text-gray-300">Csak egy válaszlehetőség jó!</p>

        {currentQuestion && (
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            <div className="p-6 rounded-lg bg-gray-800 text-white w-full">
              <h2 className="text-xl font-semibold mb-4">
                {currentQuestion.question}
              </h2>

              <AnswerPicker
                answers={shuffledAnswers}
                onPick={handleAnswerPick}
              />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={pickRandom}
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white 
                  rounded-md hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <FaSyncAlt className="mr-2" />
                Következő kérdés
              </button>

              <button
                onClick={() => setTimerEnabled((prev) => !prev)}
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
                  ${
                    timerEnabled
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-green-600 hover:bg-green-500 text-white"
                  }`}
              >
                <FaRegClock className="mr-2" />
                {timerEnabled ? "Időzítő kikapcsolása" : "Időzítő bekapcsolása"}
              </button>

              <Menu as="div" className="relative">
                <div>
                  <Menu.Button
                    className="inline-flex items-center px-4 py-2 rounded-md bg-gray-700 text-sm text-white
                    hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {timerDuration} mp
                  </Menu.Button>
                </div>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-28 origin-top-center rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {[5, 10, 15, 20, 25, 30].map((seconds) => (
                        <Menu.Item key={seconds}>
                          {({ active }) => (
                            <button
                              onClick={() => {
                                setTimerDuration(seconds);
                                setTimeLeft(seconds);
                              }}
                              className={`${
                                active
                                  ? "bg-gray-600 text-white"
                                  : "text-gray-300"
                              } flex w-full items-center justify-between px-4 py-2 text-sm`}
                            >
                              {seconds} mp
                              {timerDuration === seconds && (
                                <FaCheck className="text-green-400 ml-2" />
                              )}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>

            {timerEnabled && (
              <div className="text-gray-400 text-sm mt-4">
                Következő kérdés {timeLeft} másodperc múlva
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
