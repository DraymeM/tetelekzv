import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Transition } from "@headlessui/react";
import { FaArrowLeft, FaBookOpen, FaSyncAlt } from "react-icons/fa";
import axios from "axios";
import Navbar from "./Navbar";
import FlashCard from "./common/FlashCard";

interface Subsection {
  id: number;
  title: string;
  description: string;
}

interface Section {
  id: number;
  content: string;
  subsections: Subsection[] | null;
}

interface Osszegzes {
  id: number;
  content: string;
}

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

interface Tetel {
  id: number;
  name: string;
}

interface TetelDetailsResponse {
  tetel: Tetel;
  osszegzes: Osszegzes | null;
  sections: Section[];
  questions: Flashcard[] | null;
}

export default function TetelDetails() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);

  const { data, isLoading, error } = useQuery<TetelDetailsResponse, Error>({
    queryKey: ["tetelDetail", tetelId],
    queryFn: async () => {
      const response = await axios.get<TetelDetailsResponse>(
        `/tetelekzv/BackEnd/get_tetel_details.php?id=${tetelId}`
      );
      return response.data;
    },
    enabled: !isNaN(tetelId) && tetelId > 0,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const [learningMode, setLearningMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Safe data handling
  const tetel = data?.tetel ?? { id: 0, name: "Ismeretlen tétel" };
  const osszegzes = data?.osszegzes;
  const sections = data?.sections ?? [];
  const questions = data?.questions ?? [];

  const hasQuestions = questions.length > 0;
  const canRandomize = questions.length >= 2;

  const nextRandom = () => {
    if (!canRandomize) return;
    let idx = currentIdx;
    while (idx === currentIdx) {
      idx = Math.floor(Math.random() * questions.length);
    }
    setCurrentIdx(idx);
  };

  const enterLearning = () => {
    if (!hasQuestions) return;
    setCurrentIdx(Math.floor(Math.random() * questions.length));
    setLearningMode(true);
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <div className="animate-spin text-blue-500 text-4xl inline-block">
          <FaSyncAlt />
        </div>
        <p className="mt-4 text-gray-400">Tétel betöltése...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-red-500 text-center">
        Hiba történt: {error.message}
      </div>
    );

  return (
    <>
      <Navbar />

      <main className="relative max-w-6xl mx-auto min-h-screen mt-10 p-10 text-left">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/tetelek"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md
                     text-sm font-medium text-gray-400 hover:bg-gray-500 hover:text-white
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Vissza a tételekhez
          </Link>

          {!learningMode && hasQuestions && (
            <button
              onClick={enterLearning}
              className="inline-flex items-center px-4 py-2 bg-purple-600 border-purple-500 
                       rounded-md text-sm font-medium text-white hover:bg-purple-700 
                       focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            >
              <FaBookOpen className="mr-2" />
              Tanuló mód indítása
            </button>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">
          {tetel?.name}
        </h1>

        <Transition
          show={!learningMode}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700
                         hover:border-gray-500 transition-colors"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-100">
                  {section.content}
                </h2>
                {section.subsections?.map((subsection) => (
                  <div
                    key={subsection.id}
                    className="ml-4 mb-4 p-4 bg-gray-700 rounded-lg"
                  >
                    <h3 className="font-medium text-gray-100 mb-2">
                      {subsection.title}
                    </h3>
                    <p className="text-gray-300">{subsection.description}</p>
                  </div>
                ))}
              </div>
            ))}

            {osszegzes?.content && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-gray-100">
                  Összegzés
                </h2>
                <p className="text-gray-300 whitespace-pre-line">
                  {osszegzes.content}
                </p>
              </div>
            )}
          </div>
        </Transition>

        <Transition
          show={learningMode}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex flex-col items-center gap-6 mt-10">
            {hasQuestions && (
              <>
                <FlashCard
                  question={questions[currentIdx]?.question ?? ""}
                  answer={questions[currentIdx]?.answer ?? ""}
                />

                <div className="flex gap-4">
                  {canRandomize && (
                    <button
                      onClick={nextRandom}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg
                               hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <FaSyncAlt className="mr-2 animate-spin" />
                      Következő kérdés
                    </button>
                  )}

                  <button
                    onClick={() => setLearningMode(false)}
                    className="px-6 py-3 border border-gray-400 text-gray-300
                             rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Vissza
                  </button>
                </div>
              </>
            )}
          </div>
        </Transition>
      </main>
    </>
  );
}
