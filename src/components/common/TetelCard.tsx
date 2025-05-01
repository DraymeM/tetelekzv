import { Link } from "@tanstack/react-router";
import { FaChevronRight } from "react-icons/fa"; // Importing React Icon

interface TetelekCardProps {
  id: number;
  name: string;
  onClick?: (id: number) => void;
}

function TetelekCard({ id, name }: TetelekCardProps) {
  return (
    <div className="p-4 bg-gray-800 shadow-md rounded-md transition duration-300 border-transparent hover:border-gray-400 border-2  transform">
      <Link
        to={`/tetelek/$id`} // This matches the dynamic route for each ID
        params={{ id: id.toString() }} // Pass the dynamic route parameter
        className="flex justify-between items-center w-full h-full"
      >
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-semibold">
            <span className="font-bold text-gray-300">{id}. </span>
            {name}
          </h3>
        </div>
        <div className="flex items-center bg-gray-700 p-4 hover:cursor-pointer rounded-md text-teal-600 hover:text-teal-400 h-full">
          <FaChevronRight className=" " size={20} />
        </div>
      </Link>
    </div>
  );
}

export default TetelekCard;
