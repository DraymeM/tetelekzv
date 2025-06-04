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
import Spinner from "./Spinner";
import React from "react";
const TetelCard = React.lazy(() => import("./common/TetelCard"));
import TetelCardSkeleton from "./common/TetelCardSkeleton";
import { useAuth } from "../context/AuthContext";
import { type SidebarLink } from "./common/SideBar";
const Sidebar = React.lazy(() => import("./common/SideBar"));

export default function TetelOverview() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isChildRoute =
    location.pathname.includes("/details") ||
    location.pathname.includes("/questions") ||
    location.pathname.includes("/edit") ||
    location.pathname.includes("/flashcards");

  const { data, error, isLoading } = useQuery<TetelDetailsResponse, Error>({
    queryKey: ["tetelDetail", tetelId],
    queryFn: () => fetchTetelDetails(tetelId),
    enabled: !isNaN(tetelId) && tetelId > 0,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  if (isChildRoute) {
    const sidebarLinks: SidebarLink[] = [
      {
        to: "/tetelek/$id/details",
        label: "Részletek",
        icon: <FaBookOpen aria-hidden="true" />,
        params: { id: tetelId.toString() },
      },
      {
        to: "/tetelek/$id/questions",
        icon: <FaQuestionCircle aria-hidden="true" />,
        label: "Kérdések",
        params: { id: tetelId.toString() },
      },
      {
        to: "/tetelek/$id/flashcards",
        icon: <FaClone aria-hidden="true" />,
        label: "Kártyák",
        params: { id: tetelId.toString() },
      },
      {
        to: "/tetelek/$id",
        label: "Vissza",
        icon: <FaArrowLeft aria-hidden="true" />,
        params: { id: tetelId.toString() },
      },
    ];

    return (
      <div className="flex flex-col md:flex-row min-h-screen">
        <Suspense>
          <Sidebar links={sidebarLinks} />
        </Suspense>
        <main className="flex-1 md:ml-33  md:px-2  pb-20 md:pb-0 ">
          <Outlet />
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    if (!navigator.onLine) {
      return <OfflinePlaceholder />;
    }
    return (
      <div className="p-10 text-red-500 text-center">
        Hiba történt: {error.message}
      </div>
    );
  }

  const tetel = data?.tetel ?? { id: 0, name: "Ismeretlen tétel" };
  const hasQuestions = (data?.questions?.length ?? 0) > 0;

  return (
    <Suspense>
      <PageTransition>
        <main className="relative md:max-w-7xl max-w-full mx-auto mt-5 md:px-10 px-3 pt-10 pb-3 text-left">
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
            <Suspense fallback={<TetelCardSkeleton />}>
              <TetelCard
                to="/tetelek/$id/details"
                params={{ id: tetelId.toString() }}
                icon={
                  <FaBookOpen
                    className="mr-2 text-primary"
                    size={20}
                    aria-hidden="true"
                  />
                }
                title="Tétel Részletek"
                description="Nézd meg a tétel teljes tartalmát."
                ariaLabel={`Nézd meg a ${tetel.name} tétel részleteit`}
                titleText={`Nézd meg a ${tetel.name} tétel részleteit`}
              />
            </Suspense>

            <Suspense fallback={<TetelCardSkeleton />}>
              <TetelCard
                to="/tetelek/$id/questions"
                params={{ id: tetelId.toString() }}
                icon={
                  <FaQuestionCircle
                    className="mr-2 text-primary"
                    size={20}
                    aria-hidden="true"
                  />
                }
                title="Kérdések"
                description={
                  hasQuestions
                    ? "Tekintsd meg a tételhez tartozó kérdéseket."
                    : !isAuthenticated
                      ? "Nincsenek kérdések ehhez a tételhez."
                      : "Tekintsd meg a tételhez tartozó kérdéseket."
                }
                disabled={!isAuthenticated && !hasQuestions}
                ariaLabel={
                  hasQuestions || isAuthenticated
                    ? `Tekintsd meg a ${tetel.name} tételhez tartozó kérdéseket`
                    : `Nincsenek kérdések a ${tetel.name} tételhez`
                }
                titleText={
                  hasQuestions || isAuthenticated
                    ? `Tekintsd meg a ${tetel.name} tételhez tartozó kérdéseket`
                    : `Nincsenek kérdések a ${tetel.name} tételhez`
                }
              />
            </Suspense>

            <Suspense fallback={<TetelCardSkeleton />}>
              <TetelCard
                to="/tetelek/$id/flashcards"
                params={{ id: tetelId.toString() }}
                icon={
                  <FaClone
                    className="mr-2 text-primary"
                    size={20}
                    aria-hidden="true"
                  />
                }
                title="Villámkártyák"
                description={
                  hasQuestions
                    ? "Játssz a tétel villámkártyáival."
                    : "Nincsenek villámkártyák ehhez a tételhez."
                }
                disabled={!hasQuestions}
                ariaLabel={
                  hasQuestions
                    ? `Játssz a ${tetel.name} tétel villámkártyáival`
                    : `Nincsenek villámkártyák a ${tetel.name} tételhez`
                }
                titleText={
                  hasQuestions
                    ? `Játssz a ${tetel.name} tétel villámkártyáival`
                    : `Nincsenek villámkártyák a ${tetel.name} tételhez`
                }
              />
            </Suspense>
          </div>
        </main>
      </PageTransition>
    </Suspense>
  );
}
