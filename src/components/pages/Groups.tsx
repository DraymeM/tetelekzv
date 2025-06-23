import React, { useState, useEffect, Suspense } from "react";
import { useParams, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner";
import { fetchgroups } from "../../api/repo";
import { useAuth } from "../../context/AuthContext";
import PageTransition from "../common/PageTransition";
import { FaPlus } from "react-icons/fa";
import { LimitDropdown, Pagination } from "../common/PaginationControls";
import OfflinePlaceholder from "../OfflinePlaceholder";

const GroupCard = React.lazy(() => import("../common/GroupCard"));

export default function Groups() {
  const { gid } = useParams({ strict: false });
  const location = useLocation();
  const { isAuthenticated, userId } = useAuth();

  const shouldFetch = !gid;
  const isChildRoute =
    location.pathname.includes("/$gid") ||
    location.pathname.includes("/create");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(35);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["groups", userId, page, limit],
    queryFn: () => fetchgroups({ page, limit }),
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (shouldFetch) {
      refetch();
    }
  }, [userId]);

  if (isChildRoute || gid) return <Outlet />;

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    if (!navigator.onLine) {
      return <OfflinePlaceholder />;
    }

    return (
      <div className="p-10 text-red-500 text-center">
        Hiba történt: {error.message}
      </div>
    );
  }

  const groups = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="text-center">
      <Suspense>
        <PageTransition>
          <h2 className="text-3xl font-bold mb-8">Groups</h2>

          <div className="flex flex-wrap items-center justify-between md:gap-4 px-4 mb-4">
            <div className="flex-shrink-0 mx-auto">
              <LimitDropdown
                limit={limit}
                setLimit={(newLimit) => {
                  setPage(1);
                  setLimit(newLimit);
                }}
              />
            </div>

            <div className="flex-grow flex justify-center mx-auto md:mr-8">
              <Pagination
                page={page}
                setPage={setPage}
                total={total}
                limit={limit}
              />
            </div>

            <div className="flex-shrink-0 mx-auto p-2 text-foreground bg-secondary rounded-md shadow-lg text-sm">
              Összes: <span className="text-primary font-bold">{total}</span>
            </div>
          </div>

          <div className="min-h-[60dvh]">
            {groups.length === 0 ? (
              <p className="p-4 bg-secondary shadow-md rounded-md transition text-foreground duration-300 border-transparent hover:border-muted-foreground border-2 cursor-pointer transform">
                Nincsenek csoportok még.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-2 mb-8">
                {groups.map((group) => (
                  <Suspense
                    key={group.gid}
                    fallback={
                      <div className="rounded-md border-2 border-transparent bg-secondary p-5 shadow-sm min-h-[140px] animate-pulse" />
                    }
                  >
                    <GroupCard
                      key={group.gid}
                      gid={group.gid}
                      name={group.name}
                      public={!!group.public}
                      joined={!!group.joined}
                      member_count={group.member_count}
                      isAuthenticated={isAuthenticated}
                    />
                  </Suspense>
                ))}
              </div>
            )}
          </div>

          <Pagination
            page={page}
            setPage={setPage}
            total={total}
            limit={limit}
          />
        </PageTransition>

        {isAuthenticated && (
          <Link
            to="/groups/create"
            className="fixed bottom-2 right-2 p-3 bg-emerald-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center"
            title="Adj hozzá saját csoportot"
          >
            <FaPlus size={20} />
          </Link>
        )}
      </Suspense>
    </div>
  );
}
