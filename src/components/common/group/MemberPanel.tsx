import type { GroupMember } from "@/api/repo";
import { Popover } from "@headlessui/react";

export default function MemberPopover({ member }: { member: GroupMember }) {
  // Compute role badge text and color based on permissions
  let roleLabel = "Member";
  let roleBg = "bg-blue-500";

  if (member.can_create && member.can_update && member.can_delete) {
    roleLabel = "Admin";
    roleBg = "bg-rose-500";
  } else if (member.can_create && member.can_update) {
    roleLabel = "Creator";
    roleBg = "bg-cyan-500";
  }

  return (
    <Popover className="relative">
      <Popover.Button className="w-full text-center px-3 py-2 bg-muted hover:bg-muted/70 hover:cursor-pointer hover:text-primary rounded-md text-sm font-medium">
        {member.username}
      </Popover.Button>

      <Popover.Panel className="absolute md:right-20 right-0 top-full mt-1 w-50 p-4 bg-popover border border-border shadow-lg rounded-lg z-50">
        <h3 className="text-md font-bold flex items-center justify-between">
          {member.username}
          <span
            className={`${roleBg} text-white text-xs font-semibold px-2 py-0.5 rounded-md`}
          >
            {roleLabel}
          </span>
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Joined:{" "}
          <span className="text-primary font-bold">
            {new Date(member.joined_at).toLocaleDateString()}
          </span>
        </p>
      </Popover.Panel>
    </Popover>
  );
}
