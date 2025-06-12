import { Link } from "@tanstack/react-router";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";

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
      className="group relative block rounded-md bg-secondary  pl-1 pt-1 pb-5 min-h-[140px] border-2 border-transparent transition-all duration-300 ease-in-out hover:border-2 hover:border-[var(--border)] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      onClick={() => onClick?.(id)}
      activeProps={{ className: "shadow-xl ring-2 ring-primary ring-offset-2" }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex-1">
          <Transition
            as={Fragment}
            show={true}
            enter="transition-all duration-300 ease-out"
            enterFrom="scale-100 opacity-100"
            enterTo="group-hover:scale-105 group-hover:opacity-90"
          >
            <div className="flex items-center dark:bg-primary/10 bg-primary/20 rounded-md px-3 py-1 w-fit mb-3">
              <span className="text-lg md:text-lg font-bold">{id}</span>
            </div>
          </Transition>

          <Transition
            as={Fragment}
            show={true}
            enter="transition-transform duration-300 ease-out"
            enterFrom="translate-y-0"
            enterTo="group-hover:-translate-y-0.5"
          >
            <h3 className="text-base md:text-lg font-semibold tracking-tight text-foreground truncate">
              {title}
            </h3>
          </Transition>
        </div>

        <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded w-16 h-1.5 bg-primary/50" />
      </div>
    </Link>
  );
}

export default CardLink;
