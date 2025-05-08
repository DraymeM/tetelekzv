import Questions from "@/components/Questions";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/mquestions")({
  component: Questions,
});
