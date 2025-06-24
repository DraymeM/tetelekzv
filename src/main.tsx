import { StrictMode, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import "./styles.css";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";

import type { RouterContext } from "./api/types";
import Spinner from "./components/Spinner";
import { registerSW } from "virtual:pwa-register";
import Applayout from "./components/AppLayout";
import { idbPersister, persistQueryKeys, CACHE_VERSION } from "./db/IndexedDB";
import { checkGroupAccess } from "./api/repo";

const NotFoundPage = lazy(() => import("./components/404"));
const ErrorBoundary = lazy(() => import("./components/ErrorBoundary"));

const storedTheme = localStorage.getItem("theme") ?? "dark";
document.documentElement.classList.add(storedTheme);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
});

const [unsubscribe] = persistQueryClient({
  queryClient,
  persister: idbPersister,
  maxAge: 1000 * 60 * 60 * 24,
  buster: CACHE_VERSION,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const key = query.queryKey?.[0];
      return (
        persistQueryKeys.includes(key as string) &&
        query.state.status === "success" &&
        query.state.data !== undefined
      );
    },
  },
});

const router = createRouter({
  routeTree,
  history: createHashHistory(),
  basepath: "/",
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  context: {
    isAuthenticated: false, // Default value, updated by AuthProvider
    isSuperUser: false,
    checkGroupAccess, // Use standalone function
  } as RouterContext,
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
      <Applayout>
        <></>
      </Applayout>
    );
  }

  return (
    <RouterProvider
      router={router}
      context={{ isAuthenticated, isSuperUser, checkGroupAccess }}
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
          <Suspense>
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

registerSW({
  onNeedRefresh() {
    console.log("New content available, please refresh.");
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

if (typeof window !== "undefined") {
  window.addEventListener("before Mortality", () => {
    unsubscribe();
  });
}
