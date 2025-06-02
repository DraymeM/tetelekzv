import { useRouterState } from "@tanstack/react-router";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import { Suspense, type ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const isPending = useRouterState({
    select: (s) => s.status === "pending",
  });

  return (
    <>
      <Navbar />
      <Suspense fallback={<Spinner />}>
        <div className="flex flex-col min-h-screen relative">
          {isPending && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
              <Spinner />
            </div>
          )}

          <div className="flex-1 relative">{children}</div>
        </div>
      </Suspense>
    </>
  );
};

export default AppLayout;
