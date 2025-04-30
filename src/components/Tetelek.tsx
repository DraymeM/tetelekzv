import { useParams, Outlet, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "./Navbar";
import TetelekCard from "./common/TetelCard";
import { FaPlus, FaSpinner } from "react-icons/fa";

export interface ITetel {
  id: number;
  name: string;
}

// Axios fetch function
async function fetchTetelek(): Promise<ITetel[]> {
  const res = await axios.get<ITetel[]>(
    "/tetelekzv/BackEnd/get_tetel_list.php"
  );
  return res.data;
}

export default function Tetelek() {
  const { id } = useParams({ strict: false });

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
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-6xl" />
      </div>
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
      <h2 className="text-3xl font-bold mb-8">Tételek</h2>

      {(tetelek ?? []).length === 0 ? (
        <p className="p-4 bg-gray-800 shadow-md rounded-md transition  text-white duration-300 border-transparent hover:border-gray-400 border-2 cursor-pointer transform ">
          Nincsenek tételek még.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2 mb-8">
          {(tetelek ?? []).map((tetel) => (
            <TetelekCard key={tetel.id} id={tetel.id} name={tetel.name} />
          ))}
        </div>
      )}
      <Link
        to="/tetelcreate"
        className="fixed bottom-7 right-7 p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center"
        title="Adj hozzá saját tételt"
      >
        <FaPlus size={24} />
      </Link>
    </div>
  );
}
