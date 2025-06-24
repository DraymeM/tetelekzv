import { useState } from "react";
import type { GroupMember } from "@/api/repo";

import { FaUsers } from "react-icons/fa";
import MemberPopover from "@/components/common/group/MemberPanel";
import { HiX } from "react-icons/hi";

export default function GroupMemberSidebar({
  members,
}: {
  members: GroupMember[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed bottom-1 right-1 z-40 md:hidden bg-cyan-800 text-white p-3 hover:cursor-pointer hover:bg-cyan-700 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open member sidebar"
      >
        <FaUsers className="w-5 h-5" />
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          open
            ? "opacity-50 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } md:hidden`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-13 right-0 z-40 h-full w-50 bg-background border-l border-border flex flex-col
          transform transition-transform duration-300 ease-in-out md:hidden
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 left-4 text-foreground bg-muted p-2 rounded-full"
          onClick={() => setOpen(false)}
          aria-label="Close member sidebar"
        >
          <HiX className="w-5 h-5" />
        </button>

        <h2 className="flex items-center justify-center gap-2 text-lg font-semibold mt-10 mb-4 border-b py-2 border-border">
          <FaUsers className="w-5 h-5" />
          Tagok
        </h2>
        <ul className="flex flex-col gap-2 overflow-visible p-4">
          {members.map((m) => (
            <li key={m.username}>
              <MemberPopover member={m} />
            </li>
          ))}
        </ul>
      </aside>

      {/* Desktop sidebar (unchanged) */}
      <aside className="hidden md:flex flex-col fixed top-0 right-0 min-h-screen w-40 ml-40 bg-secondary/20 border-l border-border z-30">
        <h2 className="flex items-center justify-center gap-2 text-lg font-semibold mt-14 py-2 mb-2 border-b border-border/50">
          <FaUsers className="w-5 h-5" />
          Tagok
        </h2>
        <ul className="flex flex-col gap-2 overflow-visible p-4">
          {members.map((m) => (
            <li key={m.username}>
              <MemberPopover member={m} />
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
