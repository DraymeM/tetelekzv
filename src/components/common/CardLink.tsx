import { Link } from "@tanstack/react-router";
import { FaChevronRight } from "react-icons/fa";

interface CardLinkProps {
  id: number;
  title: string;
  to: string;
  onClick?: (id: number) => void;
}

function CardLink({ id, title, to, onClick }: CardLinkProps) {
  return (
    <Link
      to={to}
      params={{ id: id.toString() }}
      className="group relative block rounded-md border-2 border-transparent bg-secondary p-5 shadow-sm min-h-[85px] transition-all duration-300 hover:border-[var(--border)] hover:shadow-md"
      onClick={() => onClick?.(id)}
      activeProps={{ className: "border-[var(--border)] shadow-md" }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 pr-6 overflow-hidden">
          <h3 className="text-lg md:text-xl font-semibold tracking-tight truncate">
            <span
              style={{ color: "var(--foreground)" }}
              className="font-bold mr-1"
            >
              {id}.
            </span>
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-center rounded-md transition-all duration-300 bg-muted text-primary border-2 border-transparent group-hover:border-[var(--border)] group-hover:bg-muted/70 shadow-sm group-hover:shadow-md w-10 h-10">
          <FaChevronRight
            className="transition-transform duration-300 group-hover:translate-x-1"
            size={18}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded w-16 h-1.5 bg-primary/50" />
    </Link>
  );
}

export default CardLink;
