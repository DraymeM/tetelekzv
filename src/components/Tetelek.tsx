import { useParams, Outlet, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import { FaPlus } from "react-icons/fa";
import Spinner from "./Spinner";
import { fetchTetelek } from "../api/repo";
import { useAuth } from "../context/AuthContext";
import React, { Suspense } from "react";
const TetelekCard = React.lazy(() => import("./common/TetelCard"));

export default function Tetelek() {
  const { id } = useParams({ strict: false });
  const { isAuthenticated } = useAuth();
  const {
    data: tetelek,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tetelek"],
    queryFn: fetchTetelek,
  });

  if (id) return <Outlet />;

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
    <Suspense>
      <div className="text-center pt-20">
        <Navbar />
        <h2 className="text-3xl font-bold mb-8">Tételek</h2>

        {(tetelek ?? []).length === 0 ? (
          <p className="p-4 bg-secondary shadow-md rounded-md transition  text-foreground duration-300 border-transparent hover:border-muted-foreground border-2 cursor-pointer transform ">
            Nincsenek tételek még.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2 mb-8">
            {(tetelek ?? []).map((tetel) => (
              <TetelekCard key={tetel.id} id={tetel.id} name={tetel.name} />
            ))}
          </div>
        )}
        {isAuthenticated && (
          <>
            <Link
              to="/tetelcreate"
              className="fixed bottom-7 right-7 p-3 bg-emerald-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center"
              title="Adj hozzá saját tételt"
            >
              <FaPlus size={20} />
            </Link>
          </>
        )}
      </div>
    </Suspense>
  );
}
