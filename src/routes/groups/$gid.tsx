import GroupDetails from "@/components/pages/groups/GroupDetails";
import { createFileRoute, redirect } from "@tanstack/react-router";
import type { RouterContext } from "../../api/types";

export const Route = createFileRoute("/groups/$gid")({
  component: GroupDetails,
  loader: async ({ params, context }) => {
    const ctx = context as RouterContext;
    const groupId = parseInt(params.gid);
    const { checkGroupAccess } = ctx;

    const access = await checkGroupAccess(groupId);

    if (!access.isPublic && !access.isMember) {
      throw redirect({
        to: "/groups",
      });
    }

    return { groupId, canAccess: true };
  },
});
