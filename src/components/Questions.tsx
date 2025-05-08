import { useParams, Outlet, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import QuestionCard from "./common/QuestionCard";
import { FaDice, FaPlus } from "react-icons/fa";
import Spinner from "./Spinner";
import { fetchQuestions } from "../api/repo";
import { useAuth } from "../context/AuthContext";

export default function Questions() {
  const { id } = useParams({ strict: false });
  const { isAuthenticated } = useAuth();
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["multiQuestions"],
    queryFn: fetchQuestions,
  });

  if (id || location.pathname.includes("pmchq")) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <>
        {" "}
        <Navbar />
        <div className="p-10 text-center">
          <Spinner />
        </div>
      </>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Hiba: {error.message}
      </div>
    );
  }

  return (
    <div className="text-center pt-20">
      <Navbar />

      <h2 className="text-3xl font-bold mb-8">Kérdések</h2>

      {(questions ?? []).length === 0 ? (
        <p className="p-4 bg-secondary shadow-md rounded-md transition  text-foreground duration-300 border-transparent hover:border-muted-foreground border-2 cursor-pointer transform ">
          Nincsenek kérdések még.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2 mb-8">
          {(questions ?? []).map((question) => (
            <QuestionCard
              key={question.id}
              id={question.id}
              question={question.question}
            />
          ))}
        </div>
      )}
      <Link
        to="/mchoiceq"
        className="fixed bottom-7 right-7 p-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all transform hover:scale-105 flex items-center justify-center"
        title="Random kérdések"
      >
        <FaDice size={20} />
      </Link>
      {isAuthenticated && (
        <>
          <Link
            to="/pmchq"
            className="fixed bottom-22 right-7 p-3 bg-emerald-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center"
            title="Adj hozzá saját kérdést"
          >
            <FaPlus size={20} />
          </Link>
        </>
      )}
    </div>
  );
}
