import { createLazyFileRoute } from "@tanstack/react-router";
import HomePage from "../components/HomePage.tsx";

export const Route = createLazyFileRoute("/")({
  component: HomePage,
});
