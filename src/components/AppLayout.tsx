import React, { Suspense, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import Navbar from "./common/Navbar";
import Spinner from "./Spinner";

type AppLayoutProps = {
  children: ReactNode;
};

const MemoizedNavbar = React.memo(Navbar);

const AppLayout = ({ children }: AppLayoutProps) => {
  const isPending = useRouterState({
    select: (s) => s.status === "pending",
  });

  return (
    <div className="flex flex-col min-h-screen">
      <MemoizedNavbar />

      <div className="relative flex-1 mt-15">
        {isPending && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
            <Spinner />
          </div>
        )}

        <Suspense fallback={<Spinner />}>
          <div className="relative flex-1">{children}</div>
        </Suspense>
      </div>
    </div>
  );
};

export default AppLayout;
