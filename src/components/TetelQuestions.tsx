import { useState, Suspense, lazy } from "react";
import { useParams, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsByTetelId } from "../api/repo";
import { useAuth } from "../context/AuthContext";
import PageTransition from "../components/common/PageTransition";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import { LuTestTubeDiagonal } from "react-icons/lu";
import OfflinePlaceholder from "./OfflinePlaceholder";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { LimitDropdown, Pagination } from "./common/PaginationControls";

const CardLink = lazy(() => import("./common/CardLink"));

interface IQuestion {
  id: number;
  question: string;
}

export default function TetelQuestions() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const { isAuthenticated } = useAuth();
  const isOnline = useOnlineStatus();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(35);

  const shouldFetch = !isNaN(tetelId) && tetelId > 0;

  const { data, error } = useQuery<{ data: IQuestion[]; total: number }, Error>(
    {
      queryKey: ["tetelQuestions", tetelId, page, limit],
      queryFn: () => fetchQuestionsByTetelId({ tetelId, page, limit }),
      enabled: shouldFetch,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  // Check if a child route is active (e.g., /tetelek/$id/questions/$questionId)
  if (
    location.pathname.includes("/questions/") &&
    location.pathname !== `/tetelek/${tetelId}/questions`
  ) {
    return <Outlet />;
  }

  if (error) {
    if (!isOnline) {
      return (
        <>
          <OfflinePlaceholder />
        </>
      );
    }

    return (
      <>
        <div className="text-center mt-10 text-red-500">
          Hiba: {error.message}
        </div>
      </>
    );
  }

  const questions = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <Suspense>
      <div className="text-center pt-20">
        <PageTransition>
          <div className="flex items-center justify-between mb-8 px-4">
            <Link
              to="/tetelek/$id"
              params={{ id: tetelId.toString() }}
              className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label="Vissza a tételhez"
              title="Vissza a tételhez"
            >
              <FaArrowLeft className="mr-2" />
              Vissza
            </Link>
            <h2 className="text-3xl font-bold">Kérdések</h2>
            <div className="w-[100px]"></div> {/* Spacer for alignment */}
          </div>
          <div className="flex flex-wrap items-center justify-between md:gap-4 px-4 mb-4">
            {/* Left: Limit Dropdown */}
            <div className="flex-shrink-0 mx-auto">
              <LimitDropdown
                limit={limit}
                setLimit={(newLimit) => {
                  setPage(1);
                  setLimit(newLimit);
                }}
              />
            </div>

            {/* Center: Pagination */}
            <div className="flex-grow flex justify-center mx-auto md:mr-8">
              <Pagination
                page={page}
                setPage={setPage}
                total={total}
                limit={limit}
              />
            </div>
            {/* Right: Total */}
            <div className="flex-shrink-0 mx-auto p-2 text-foreground bg-secondary rounded-md shadow-lg text-sm">
              Összes: <span className="text-primary font-bold">{total}</span>
            </div>
          </div>
          <div className="min-h-[60dvh]">
            {questions.length === 0 ? (
              <p className="p-4 mx-auto max-w-[98dvw] bg-secondary shadow-md rounded-md transition text-foreground duration-300 border-transparent hover:border-muted-foreground border-2 cursor-pointer transform">
                Nincsenek még kérdések ehhez a tételhez.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2 mb-8">
                {questions.map((question, index) => (
                  <Suspense
                    key={question.id} // Use real ID for React key
                    fallback={
                      <div className="rounded-md border-2 border-transparent bg-secondary p-5 shadow-sm min-h-[85px] animate-pulse" />
                    }
                  >
                    <CardLink
                      id={index + 1} // Show 1., 2., 3. in the UI
                      title={question.question}
                      to={`/tetelek/${tetelId}/questions/${question.id}`} // Keep route correct
                    />
                  </Suspense>
                ))}
              </div>
            )}
          </div>

          <Pagination
            page={page}
            setPage={setPage}
            total={total}
            limit={limit}
          />
        </PageTransition>
        <Link
          to="/tetelek/$id/questions/test"
          params={{ id: tetelId.toString() }}
          className="fixed md:bottom-7 bottom-14 right-5 p-3 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-all transform hover:scale-105 flex items-center justify-center"
          title="Teszteld magad"
        >
          <LuTestTubeDiagonal size={20} />
        </Link>
        {isAuthenticated && (
          <Link
            to="/tetelek/$id/questions/add"
            params={{ id: tetelId.toString() }}
            className="fixed md:bottom-22 bottom-28 right-5 p-3 bg-emerald-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center"
            title="Adj hozzá saját kérdést"
          >
            <FaPlus size={20} />
          </Link>
        )}
      </div>
    </Suspense>
  );
}
