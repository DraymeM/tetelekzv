import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Transition } from "@headlessui/react";
import { FaArrowLeft, FaBookOpen, FaSyncAlt } from "react-icons/fa";
import Navbar from "./Navbar";
import { fetchTetelDetail } from "../api/repo";
import FlashCard from "./common/FlashCard";

export default function TetelDetails() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const { data, isLoading, error } = useQuery({
    queryKey: ["tetelDetail", tetelId],
    queryFn: () => fetchTetelDetail(tetelId),
    enabled: !isNaN(tetelId),
  });
  const [learningMode, setLearningMode] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  if (isLoading) return <div className="p-10">Loading…</div>;
  if (error instanceof Error)
    return <div className="p-10 text-red-500">Error: {error.message}</div>;

  const { tetel, osszegzes, sections, questions } = data!;

  const nextRandom = () => {
    if (questions.length < 2) return;
    let idx = currentIdx;
    while (idx === currentIdx) {
      idx = Math.floor(Math.random() * questions.length);
    }
    setCurrentIdx(idx);
  };

  const enterLearning = () => {
    setCurrentIdx(Math.floor(Math.random() * questions.length));
    setLearningMode(true);
  };

  return (
    <>
      <Navbar />

      <main className="relative max-w-6xl mx-auto min-h-screen mt-10 p-10 text-left">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/tetelek"
            className="inline-flex items-center px-3 py-2 border  border-gray-300 rounded-md
                       text-sm font-medium text-gray-400 hover:bg-gray-500 hover:text-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaArrowLeft className="mr-2" />
            Vissza a tételekhez
          </Link>

          {!learningMode && questions.length > 0 && (
            <button
              onClick={enterLearning}
              className="inline-flex items-center px-3 py-2 border bg-purple-600 border-purple-500 
                         rounded-md text-sm font-medium text-white 
                         hover:bg-purple-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <FaBookOpen className="mr-2" />
              Tanulás
            </button>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">{tetel.name}</h1>
        <Transition
          show={!learningMode}
          as="div"
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            {sections.map((sec) => (
              <div
                key={sec.id}
                className="bg-gray-800 shadow-md rounded-md p-4 mb-6
                           border-2 border-transparent hover:border-gray-400
                           transition duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-100">
                  {sec.content}
                </h3>
                {sec.subsections.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-gray-700 rounded-md p-3 mb-3 ml-4"
                  >
                    <h4 className="font-bold text-gray-100">{sub.title}</h4>
                    <p className="text-gray-200">{sub.description}</p>
                  </div>
                ))}
              </div>
            ))}
            {osszegzes && (
              <div
                className="bg-gray-800 shadow-md rounded-md p-4 mb-6
                           border-2 border-transparent hover:border-gray-400
                           transition duration-300"
              >
                <h2 className="text-2xl font-semibold mb-2 text-gray-100">
                  Összegzés
                </h2>
                <hr className="border-gray-600 mb-4" />
                <p className="text-gray-100">{osszegzes.content}</p>
              </div>
            )}
          </div>
        </Transition>
        <Transition
          show={learningMode}
          as="div"
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="flex flex-col items-center gap-6">
            <FlashCard
              question={questions[currentIdx].question}
              answer={questions[currentIdx].answer}
            />

            <button
              onClick={nextRandom}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white 
                         rounded-md hover:bg-orange-400 focus:outline-none hover:cursor-pointer focus:ring-2 
                         focus:ring-orange-500"
            >
              <FaSyncAlt className="mr-2 animate-spin" />
              Következő kérdés
            </button>

            <button
              onClick={() => setLearningMode(false)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md
                         text-sm font-medium text-gray-400 cursor-pointer
                         hover:bg-gray-500 hover:text-white
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaArrowLeft className="mr-2" />
              Vissza a tételhez
            </button>
          </div>
        </Transition>
      </main>
    </>
  );
}
