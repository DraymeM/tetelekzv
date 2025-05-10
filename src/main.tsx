import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import Applayout from "./components/AppLayout.tsx";
import Spinner from "./components/Spinner.tsx";
import NotFoundPage from "./components/404.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { RouterContext } from "./api/types";
const storedTheme = localStorage.getItem("theme") ?? "dark";
document.documentElement.classList.add(storedTheme);
const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  basepath: "/tetelekzv",
  defaultPreload: "intent",
  context: () =>
    ({
      isAuthenticated: false,
      isSuperUser: false,
    }) as RouterContext,
  defaultComponent: Applayout,
  defaultPendingComponent: Spinner,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorBoundary,
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
    RouterContext: RouterContext;
  }
}

const RouterWrapper = () => {
  const { isAuthenticated, isSuperUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{
        isAuthenticated,
        isSuperUser,
      }}
    />
  );
};

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterWrapper />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeButton={true}
            rtl={false}
            pauseOnFocusLoss={true}
            draggable={true}
            pauseOnHover={true}
            toastClassName="custom-toast"
            className="custom-toast-body"
          />
        </QueryClientProvider>
      </AuthProvider>
    </StrictMode>
  );
}

reportWebVitals();
