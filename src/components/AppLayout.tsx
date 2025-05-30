import { Outlet, useRouterState } from "@tanstack/react-router";
import { Transition } from "@headlessui/react";
import Navbar from "./Navbar";
import Spinner from "./Spinner";
import { Suspense } from "react";

const AppLayout: React.FC = () => {
  const isPending = useRouterState({
    select: (s) => s.status === "pending",
  });

  return (
    <Suspense>
      <div className="flex flex-col min-h-screen relative">
        <Navbar />
        {isPending && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
            <Spinner />
          </div>
        )}

        <div className="flex-1 relative">
          <Transition
            appear
            show={!isPending}
            enter="transition-opacity duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Outlet />
          </Transition>
        </div>
      </div>
    </Suspense>
  );
};

export default AppLayout;
