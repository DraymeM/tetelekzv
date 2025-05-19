import { StrictMode, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles.css";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";
import type { RouterContext } from "./api/types";
import Spinner from "./components/Spinner";

const Applayout = lazy(() => import("./components/AppLayout"));
const NotFoundPage = lazy(() => import("./components/404"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));

const storedTheme = localStorage.getItem("theme") ?? "dark";
document.documentElement.classList.add(storedTheme);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// 🧭 Router setup
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  basepath: "/tetelekzv",
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  context: () =>
    ({
      isAuthenticated: false,
      isSuperUser: false,
    }) as RouterContext,
  defaultComponent: Applayout,
  defaultPendingComponent: Spinner,
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorBoundary,
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
      context={{ isAuthenticated, isSuperUser }}
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
          <Suspense fallback={<Spinner />}>
            <RouterWrapper />
          </Suspense>
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
