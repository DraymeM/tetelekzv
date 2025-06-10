import { Suspense, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchTetelDetails } from "../../api/repo";
import type { TetelDetailsResponse } from "../../api/types";
import OfflinePlaceholder from "../OfflinePlaceholder";
import { FaArrowLeft } from "react-icons/fa";
import React from "react";

const LearningMode = React.lazy(
  () => import("../common/FlashcardGame/LearningMode")
);

export default function FlashcardGamePage() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const navigate = useNavigate();
  const location = useLocation();

  const { data, error } = useQuery<TetelDetailsResponse, Error>({
    queryKey: ["tetelDetail", tetelId],
    queryFn: () => fetchTetelDetails(tetelId),
    enabled: !isNaN(tetelId) && tetelId > 0,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  if (error) {
    if (!navigator.onLine) {
      return <OfflinePlaceholder />;
    }
    return (
      <>
        <div className="p-10 text-red-500 text-center">
          Hiba történt: {error.message}
        </div>
      </>
    );
  }

  const questions = data?.questions ?? [];

  return (
    <>
      <main className="relative md:max-w-7xl max-w-full mx-auto md:px-10 px-3">
        <div className="flex justify-between items-center mb-1">
          <Link
            to="/tetelek/$id"
            params={{ id: tetelId.toString() }}
            className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            aria-label="Vissza a tétel áttekintéséhez"
            title="Vissza a tételhez"
          >
            <FaArrowLeft className="mr-2" aria-hidden="true" />
            Vissza
          </Link>
        </div>
        <Suspense>
          <LearningMode
            questions={questions}
            onExit={() =>
              navigate({
                to: "/tetelek/$id",
                params: { id: tetelId.toString() },
              })
            }
          />
        </Suspense>
      </main>
    </>
  );
}
