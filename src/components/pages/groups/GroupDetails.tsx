import { fetchGroupDetail, fetchGroupMembers } from "@/api/repo";
import PageTransition from "@/components/common/PageTransition";
import Spinner from "@/components/Spinner";
import GroupMemberSidebar from "@/components/common/group/GroupMemberSidebar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { FaLock, FaLockOpen } from "react-icons/fa";

export default function GroupDetails() {
  const { gid } = useParams({ strict: false }) as { gid: string };
  const groupId = parseInt(gid);

  const {
    data: group,
    isLoading: loadingGroup,
    error: groupError,
  } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroupDetail(groupId),
    enabled: !!groupId,
  });

  const {
    data: members,
    isLoading: loadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ["group-members", groupId],
    queryFn: () => fetchGroupMembers(groupId),
    enabled: !!groupId,
  });

  if (loadingGroup || loadingMembers) {
    return (
      <div className="p-10 text-center">
        <Spinner />
      </div>
    );
  }

  if (groupError || membersError) {
    return (
      <div className="text-red-500 text-center p-10">
        Hiba történt: {groupError?.message || membersError?.message}
      </div>
    );
  }

  return (
    <>
      <PageTransition>
        <div className="p-6 mx-auto flex gap-6 md:mr-30">
          {/* Right: Group Details */}
          <div className="flex-1 mx-auto max-w-xl ">
            <div className="relative mb-10 text-center">
              <div
                className={`absolute -top-6 right-0 flex items-center space-x-1 px-2 py-0.5 border-border/30 border-2 rounded-sm bg-opacity-80 text-xs font-semibold
                  ${
                    group?.public
                      ? "bg-emerald-200 text-emerald-800"
                      : "bg-rose-200 text-rose-800"
                  }`}
              >
                {group?.public ? (
                  <FaLockOpen size={13} />
                ) : (
                  <FaLock size={13} />
                )}
                <span>{group?.public ? "Public" : "Private"}</span>
              </div>
              <h1 className="text-3xl font-bold">{group?.name}</h1>
            </div>
            {/* Additional group details go here */}
          </div>
        </div>
      </PageTransition>

      {members && <GroupMemberSidebar members={members} />}
    </>
  );
}
