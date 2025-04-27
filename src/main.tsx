import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and QueryClientProvider
import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import Applayout from "./components/AppLayout.tsx";

const queryClient = new QueryClient();

// Create the router
const router = createRouter({
  routeTree,
  basepath: "/tetelekzv",
  defaultPreload: "intent",
  context: {},
  defaultComponent: Applayout,
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );
}

reportWebVitals();
