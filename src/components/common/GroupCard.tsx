import { Link } from "@tanstack/react-router";
import { Route as GroupDetailRoute } from "../../routes/groups/$gid"; // Adjust path
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { toast } from "react-toastify";

interface GroupCardProps {
  gid: number;
  name: string;
  joined: boolean;
  public: boolean;
  member_count: number;
  isAuthenticated?: boolean;
}

export default function GroupCard({
  gid,
  name,
  joined,
  public: isPublic,
  member_count,
  isAuthenticated = true,
}: GroupCardProps) {
  return (
    <div className="group relative rounded-md bg-secondary border-2 min-h-[160px] border-transparent hover:border-muted-foreground shadow transition-all duration-300 ease-in-out">
      <div className="py-5 flex flex-col h-full justify-between">
        <div
          className={`absolute top-0 right-0 z-10 flex items-center space-x-1 px-2 py-0.5 border-border/30 border-2 rounded-sm bg-opacity-80
        text-xs font-semibold
        ${
          isPublic
            ? "bg-emerald-200 text-emerald-800"
            : "bg-rose-200 text-rose-800"
        }`}
        >
          {isPublic ? <FaLockOpen size={13} /> : <FaLock size={13} />}
          <span>{isPublic ? "Public" : "Private"}</span>
        </div>

        <Transition
          as={Fragment}
          show={true}
          enter="transition-all duration-300 ease-out"
          enterFrom="scale-100 opacity-100"
          enterTo="group-hover:scale-105 group-hover:opacity-90"
        >
          <div className="hidden">
            <span>{gid}</span>
          </div>
        </Transition>

        <div className="flex-1  ">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {name}
          </h3>
          <div className="border-b border-border/20" />
        </div>

        <div className="mt-1 mb-5 px-5">
          {joined || isPublic ? (
            <Link
              to={GroupDetailRoute.to}
              params={{ gid: gid.toString() }}
              className="inline-block text-sm font-medium text-foreground px-3 py-1.5 rounded-md bg-primary/50 hover:bg-primary/60 hover:cursor-pointer hover:shadow-lg"
            >
              Go to group →
            </Link>
          ) : isAuthenticated ? (
            <button
              onClick={() => toast.info("Request invite sent!")}
              className="inline-block text-sm font-medium px-3 py-1.5 rounded-md bg-primary/50 text-foreground hover:bg-primary/60 hover:cursor-pointer"
            >
              Request Invite
            </button>
          ) : (
            <button disabled className="hidden"></button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 bg-muted px-2 py-1 rounded-sm text-xs font-semibold text-muted-foreground select-none pointer-events-none">
        <span className="text-primary font-bold">{member_count}</span> member
        {member_count !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
