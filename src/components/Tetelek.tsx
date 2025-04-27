import { useParams, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import { fetchTetelek } from "../api/repo";
import type { ITetel } from "../api/repo";
import TetelekCard from "./common/TetelCard";
import { FaSpinner } from "react-icons/fa"; // Importing the spinner icon

export default function Tetelek() {
  const { id } = useParams({ strict: false });

  const { data, isLoading, error } = useQuery<ITetel[]>({
    queryKey: ["tetelek"],
    queryFn: fetchTetelek,
  });

  if (id) {
    return <Outlet />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-6xl" />
      </div>
    );
  }

  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="text-center pt-20">
      <Navbar />
      <h2 className="text-3xl font-bold mb-8">Tételek</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2 mb-8">
        {data!.map((tetel) => (
          <TetelekCard key={tetel.id} id={tetel.id} name={tetel.name} />
        ))}
      </div>
    </div>
  );
}
