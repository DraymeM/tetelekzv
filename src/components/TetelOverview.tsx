import { Link, Outlet, useParams, useLocation } from "@tanstack/react-router";
import {
  FaArrowLeft,
  FaBookOpen,
  FaQuestionCircle,
  FaClone,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchTetelDetails } from "../api/repo";
import type { TetelDetailsResponse } from "../api/types";
import OfflinePlaceholder from "./OfflinePlaceholder";
import PageTransition from "./common/PageTransition";
import { Suspense } from "react";

export default function TetelOverview() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const location = useLocation();

  const isChildRoute =
    location.pathname.includes("/details") ||
    location.pathname.includes("/questions") ||
    location.pathname.includes("/edit") ||
    location.pathname.includes("/flashcards");

  const { data, error } = useQuery<TetelDetailsResponse, Error>({
    queryKey: ["tetelDetail", tetelId],
    queryFn: () => fetchTetelDetails(tetelId),
    enabled: !isNaN(tetelId) && tetelId > 0,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  if (isChildRoute) {
    return <Outlet />;
  }

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

  const tetel = data?.tetel ?? { id: 0, name: "Ismeretlen tétel" };
  const hasQuestions = (data?.questions?.length ?? 0) > 0;

  return (
    <>
      <Suspense>
        <PageTransition>
          <main className="relative md:max-w-7xl max-w-full mx-auto mt-5 md:px-10 px-3 pt-10 pb-1 text-left">
            <Link
              to="/tetelek"
              className="inline-flex items-center px-3 py-2 border border-border my-6 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label="Vissza a tételek listájához"
              title="Vissza a tételekhez"
            >
              <FaArrowLeft className="mr-2" aria-hidden="true" />
              Tételekhez
            </Link>
            <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
              {tetel.name}
            </h1>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card for Tetel Details */}
              <Link
                to="/tetelek/$id/details"
                params={{ id: tetelId.toString() }}
                className="bg-secondary rounded-lg p-6 shadow-xl border border-transparent hover:border-border transition-colors flex items-center justify-center"
                aria-label={`Nézd meg a ${tetel.name} tétel részleteit`}
                title={`Nézd meg a ${tetel.name} tétel részleteit`}
              >
                <div className="text-center text-primary">
                  <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-center">
                    <FaBookOpen
                      className="mr-2 text-primary"
                      size={20}
                      aria-hidden="true"
                    />
                    Tétel Részletek
                  </h2>
                  <p className="text-secondary-foreground">
                    Nézd meg a tétel teljes tartalmát.
                  </p>
                </div>
              </Link>

              {/* Card for Questions */}
              <Link
                to="/tetelek/$id/questions"
                params={{ id: tetelId.toString() }}
                className={`bg-secondary rounded-lg p-6 shadow-xl border border-transparent hover:border-border transition-colors flex items-center justify-center ${
                  !hasQuestions ? "opacity-50 pointer-events-none" : ""
                }`}
                aria-label={
                  hasQuestions
                    ? `Tekintsd meg a ${tetel.name} tételhez tartozó kérdéseket`
                    : `Nincsenek kérdések a ${tetel.name} tételhez`
                }
                title={
                  hasQuestions
                    ? `Tekintsd meg a ${tetel.name} tételhez tartozó kérdéseket`
                    : `Nincsenek kérdések a ${tetel.name} tételhez`
                }
              >
                <div className="text-center text-primary">
                  <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-center">
                    <FaQuestionCircle
                      className="mr-2 text-primary"
                      size={20}
                      aria-hidden="true"
                    />
                    Kérdések
                  </h2>
                  <p className="text-secondary-foreground">
                    {hasQuestions
                      ? "Tekintsd meg a tételhez tartozó kérdéseket."
                      : "Nincsenek kérdések ehhez a tételhez."}
                  </p>
                </div>
              </Link>

              {/* Card for Flashcards */}
              <Link
                to="/tetelek/$id/flashcards"
                params={{ id: tetelId.toString() }}
                className={`bg-secondary rounded-lg p-6 shadow-xl border border-transparent hover:border-border transition-colors flex items-center justify-center ${
                  !hasQuestions ? "opacity-50 pointer-events-none" : ""
                }`}
                aria-label={
                  hasQuestions
                    ? `Játssz a ${tetel.name} tétel villámkártyáival`
                    : `Nincsenek villámkártyák a ${tetel.name} tételhez`
                }
                title={
                  hasQuestions
                    ? `Játssz a ${tetel.name} tétel villámkártyáival`
                    : `Nincsenek villámkártyák a ${tetel.name} tételhez`
                }
              >
                <div className="text-center text-primary">
                  <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-center">
                    <FaClone
                      className="mr-2 text-primary"
                      size={20}
                      aria-hidden="true"
                    />
                    Villámkártyák
                  </h2>
                  <p className="text-secondary-foreground mb-2">
                    {hasQuestions
                      ? "Játssz a tétel villámkártyáival."
                      : "Nincsenek villámkártyák ehhez a tételhez."}
                  </p>
                </div>
              </Link>
            </div>
          </main>
        </PageTransition>
      </Suspense>
    </>
  );
}
