import { Link, Outlet, useParams, useLocation } from "@tanstack/react-router";
import Navbar from "./Navbar";
import { FaArrowLeft, FaBookOpen, FaQuestionCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchTetelDetails } from "../api/repo";
import type { TetelDetailsResponse } from "../api/types";
import Spinner from "./Spinner";
import OfflinePlaceholder from "./OfflinePlaceholder";

export default function TetelOverview() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const location = useLocation();

  // Check if the current route is a child route
  const isChildRoute =
    location.pathname.includes("/details") ||
    location.pathname.includes("/questions") ||
    location.pathname.includes("/edit");

  const { data, isLoading, error } = useQuery<TetelDetailsResponse, Error>({
    queryKey: ["tetelDetail", tetelId],
    queryFn: () => fetchTetelDetails(tetelId),
    enabled: !isNaN(tetelId) && tetelId > 0,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Render only the Outlet for child routes
  if (isChildRoute) {
    return <Outlet />;
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

  if (error) {
    if (!navigator.onLine) {
      return <OfflinePlaceholder />;
    }
    return (
      <>
        <Navbar />
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
      <Navbar />
      <main className="relative md:max-w-7xl max-w-full mx-auto mt-10 md:px-10 px-3 pt-10 pb-1 text-left">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
          {tetel.name}
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card for Tetel Details */}
          <Link
            to="/tetelek/$id/details"
            params={{ id: tetelId.toString() }}
            className="bg-secondary rounded-lg p-6 shadow-xl border border-transparent hover:border-border transition-colors flex items-center justify-center"
          >
            <div className="text-center text-primary">
              <FaBookOpen className="mx-auto mb-4" size={40} />
              <h2 className="text-xl font-semibold text-foreground">
                Tétel Részletek
              </h2>
              <p className="text-secondary-foreground">
                Nézd meg a tétel teljes tartalmát és összefoglalóját.
              </p>
            </div>
          </Link>

          {/* Card for Questions */}
          <Link
            to="/tetelek/$id/questions"
            params={{ id: tetelId.toString() }}
            className={`bg-secondary rounded-lg p-6 shadow-xl border border-transparent hover:border-border transition-colors flex items-center justify-center  ${
              !hasQuestions ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="text-center text-primary">
              <FaQuestionCircle className="mx-auto mb-4" size={40} />
              <h2 className="text-xl font-semibold text-foreground">
                Kérdések
              </h2>
              <p className="text-secondary-foreground">
                {hasQuestions
                  ? "Tekintsd meg a tételhez tartozó kérdéseket."
                  : "Nincsenek kérdések ehhez a tételhez."}
              </p>
            </div>
          </Link>
        </div>
        <Link
          to="/tetelek"
          className="inline-flex items-center px-3 py-2 border border-border mt-6 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Vissza a tételekhez"
          title="Vissza a tételekhez"
        >
          <FaArrowLeft className="mr-2" />
          Tételekhez
        </Link>
      </main>
    </>
  );
}
