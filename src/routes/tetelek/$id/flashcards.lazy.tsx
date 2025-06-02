import FlashcardGamePage from "../../../components/FlashcardGamePage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/flashcards")({
  component: FlashcardGamePage,
});
