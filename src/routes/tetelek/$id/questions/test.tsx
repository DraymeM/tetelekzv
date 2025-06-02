import TetelTestYourself from "@/components/TetelTestYourself";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tetelek/$id/questions/test")({
  component: TetelTestYourself,
});
