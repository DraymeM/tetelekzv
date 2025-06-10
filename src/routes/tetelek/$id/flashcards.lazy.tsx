import FlashcardGamePage from "../../../components/pages/FlashcardGamePage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/tetelek/$id/flashcards")({
  component: FlashcardGamePage,
});
