import { createFileRoute } from "@tanstack/react-router";
import Questions from "../components/Questions";
export const Route = createFileRoute("/mquestions")({
  component: Questions,
});
