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

// PWA registration import
import { registerSW } from "virtual:pwa-register";

// Import idb-keyval for IndexedDB access
import { set, get, del } from "idb-keyval";

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

const QUERY_CACHE_KEY = "REACT_QUERY_OFFLINE_CACHE";

// IndexedDB persister for React Query cache
const idbPersister = {
  persistClient: async (client: unknown) => {
    try {
      await set(QUERY_CACHE_KEY, client);
    } catch (error) {
      console.error("Error persisting query client to IndexedDB:", error);
    }
  },
  restoreClient: async () => {
    try {
      const cache = await get(QUERY_CACHE_KEY);
      return cache ?? undefined;
    } catch (error) {
      console.error("Error restoring query client from IndexedDB:", error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      await del(QUERY_CACHE_KEY);
    } catch (error) {
      console.error("Error removing query client from IndexedDB:", error);
    }
  },
};

persistQueryClient({
  queryClient,
  persister: idbPersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const key = query.queryKey?.[0];
      return (
        key === "tetelek" ||
        key === "tetelDetail" ||
        key === "tetel-count" ||
        key === "question-count" ||
        key === "flashcard-count" ||
        key === "tetel-list-home"
      );
    },
  },
});

// 🧭 Router setup
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  basepath: "/",
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

// Register PWA service worker
registerSW({
  onNeedRefresh() {
    console.log("New content available, please refresh.");
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});
