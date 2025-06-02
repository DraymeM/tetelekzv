import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import AppLayout from "../components/AppLayout"; // make sure this is correct

export const Route = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
      <TanStackRouterDevtools />
    </AppLayout>
  ),
});
