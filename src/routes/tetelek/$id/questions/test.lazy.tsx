import TetelTestYourself from "@/components/pages/TetelTestYourself";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/questions/test")({
  component: TetelTestYourself,
});
