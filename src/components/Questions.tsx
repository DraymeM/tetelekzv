import { useState, Suspense, lazy } from "react";
import { useParams, Outlet, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "../api/repo";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import PageTransition from "../components/common/PageTransition";
import { FaDice, FaPlus } from "react-icons/fa";
import OfflinePlaceholder from "./OfflinePlaceholder";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { LimitDropdown, Pagination } from "./common/PaginationControls";

const CardLink = lazy(() => import("./common/CardLink"));

export default function Questions() {
  const { id } = useParams({ strict: false });
  const { isAuthenticated } = useAuth();
  const isOnline = useOnlineStatus();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(35);

  const shouldFetch = !id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["multiQuestions", page, limit],
    queryFn: () => fetchQuestions({ page, limit }),
    enabled: shouldFetch,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  if (id || location.pathname.includes("pmchq")) {
    return <Outlet />;
  }
  if (!isOnline) {
    return (
      <>
        <OfflinePlaceholder />
      </>
    );
  }
  if (isLoading) {
    return (
      <>
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

  const questions = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <Suspense fallback={<Spinner />}>
      <div className="text-center pt-20">
        <Navbar />
        <PageTransition>
          <h2 className="text-3xl font-bold mb-8">Kérdések</h2>
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
            <div className="flex-shrink-0 px-2 mx-auto text-muted-foreground text-sm">
              Összes: {total}
            </div>
          </div>
          <div className="min-h-[60dvh]">
            {questions.length === 0 ? (
              <p className="p-4 bg-secondary shadow-md rounded-md transition text-foreground duration-300 border-transparent hover:border-muted-foreground border-2 cursor-pointer transform">
                Nincsenek kérdések még.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2 mb-8">
                {questions.map((question) => (
                  <CardLink
                    key={question.id}
                    id={question.id}
                    title={question.question}
                    to={`/mquestions/${question.id}`}
                  />
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
          to="/mchoiceq"
          className="fixed bottom-7 right-7 p-3 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all transform hover:scale-105 flex items-center justify-center"
          title="Random kérdések"
        >
          <FaDice size={20} />
        </Link>

        {isAuthenticated && (
          <Link
            to="/pmchq"
            className="fixed bottom-24 right-7 p-3 bg-emerald-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center"
            title="Adj hozzá saját kérdést"
          >
            <FaPlus size={20} />
          </Link>
        )}
      </div>
    </Suspense>
  );
}
