import { Link } from "@tanstack/react-router";
import { FaChevronRight } from "react-icons/fa";

interface TetelekCardProps {
  id: number;
  name: string;
  onClick?: (id: number) => void;
}

function TetelekCard({ id, name }: TetelekCardProps) {
  return (
    <div className="p-4 shadow-md rounded-md transition duration-300 border-2 transform text-foreground border-transparent bg-secondary hover:border-[var(--border)]">
      <Link
        to={`/tetelek/$id`}
        params={{ id: id.toString() }}
        className="flex justify-between items-center w-full h-full"
      >
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-semibold ">
            <span style={{ color: "var(--foreground)" }} className="font-bold">
              {id}.{" "}
            </span>
            {name}
          </h3>
        </div>
        <div className="flex items-center p-4 hover:cursor-pointer rounded-md h-full transition-colors bg-muted text-primary">
          <FaChevronRight size={20} />
        </div>
      </Link>
    </div>
  );
}

export default TetelekCard;
