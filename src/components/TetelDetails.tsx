import { Suspense, useEffect, useState } from "react";
import {
  useParams,
  useLocation,
  Outlet,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTetelDetails, deleteTetel } from "../api/repo";
import type { TetelDetailsResponse } from "../api/types";
import { FaArrowLeft, FaPen, FaRegClock, FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import DeleteModal from "./common/Forms/DeleteModal";
import PageTransition from "../components/common/PageTransition";
import React from "react";
import OfflinePlaceholder from "./OfflinePlaceholder";
import SpeechController from "./common/SpeechController";

function calculateReadingTime(
  sections: TetelDetailsResponse["sections"],
  osszegzes?: TetelDetailsResponse["osszegzes"]
): number {
  const getTextFromMarkdown = (markdown: string) =>
    markdown
      .replace(/[#_*>\-`]/g, "")
      .replace(/\[.*?\]\(.*?\)/g, "")
      .replace(/!\[.*?\]\(.*?\)/g, "")
      .replace(/`{1,3}[\s\S]*?`{1,3}/g, "")
      .replace(/\s+/g, " ")
      .trim();

  let totalText = "";

  sections.forEach((section) => {
    totalText += " " + getTextFromMarkdown(section.content);
    section.subsections?.forEach((sub) => {
      totalText += " " + getTextFromMarkdown(sub.title || "");
      totalText += " " + getTextFromMarkdown(sub.description || "");
    });
  });

  if (osszegzes?.content) {
    totalText += " " + getTextFromMarkdown(osszegzes.content);
  }

  const wordCount = totalText.split(" ").filter(Boolean).length;
  return Math.ceil(wordCount / 200); // ~200 WPM
}

export default function TetelDetails() {
  const { isAuthenticated, isSuperUser } = useAuth();
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEditMode = location.pathname.includes("/edit");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, error } = useQuery<TetelDetailsResponse, Error>({
    queryKey: ["tetelDetail", tetelId],
    queryFn: () => fetchTetelDetails(tetelId),
    enabled: !isNaN(tetelId) && tetelId > 0,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  const MarkdownHandler = React.lazy(
    () => import("./common/markdown/MarkdownHandler")
  );

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!isAuthenticated || !isSuperUser) {
        toast.error("Nincs engedélyed a művelethez");
        throw new Error("Nincs engedélyed a művelethez");
      }
      return deleteTetel(tetelId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tetelek"] });
      toast.success("Sikeresen törölted a tételt.");
      navigate({ to: "/tetelek" });
    },
  });

  if (error) {
    if (!navigator.onLine) {
      return <OfflinePlaceholder />;
    }
    return (
      <>
        <div className="p-10 text-red-500 text-center">
          Hiba történt: {error.message}
        </div>
      </>
    );
  }

  if (isEditMode) {
    return <Outlet />;
  }

  const tetel = data?.tetel ?? { id: 0, name: "Ismeretlen tétel" };
  const osszegzes = data?.osszegzes;
  const sections = data?.sections ?? [];

  const readingMinutes = calculateReadingTime(sections, osszegzes);
  const textToSpeak = [
    tetel.name,
    ...sections.flatMap((section) => [
      section.content,
      ...(section.subsections?.flatMap((sub) => [sub.title, sub.description]) ??
        []),
    ]),
    "Összegzés:",
    osszegzes?.content ?? "",
    "Vége",
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <>
      <Suspense>
        <main className="relative md:max-w-7xl max-w-full mx-auto mt-10 md:px-10 px-3 pt-10 pb-1 text-left">
          <PageTransition>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <Link
                to="/tetelek/$id"
                params={{ id: tetelId.toString() }}
                className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Vissza a tétel áttekintéséhez"
                title="Vissza a tételhez"
              >
                <FaArrowLeft className="mr-2" aria-hidden="true" />
                Vissza
              </Link>

              <div className="flex items-center md:gap-4 gap-1">
                <span className="text-sm mx-auto text-secondary-foreground">
                  <FaRegClock
                    className="inline mr-1"
                    size={15}
                    aria-hidden="true"
                  />
                  {readingMinutes} perc
                </span>
                <SpeechController text={textToSpeak} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
              {tetel.name}
            </h1>

            {/* Content */}
            <div className="space-y-6">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-secondary rounded-lg p-6 shadow-xl border border-transparent hover:border-border transition-colors"
                >
                  <Suspense
                    fallback={
                      <div className="bg-secondary rounded-lg p-6 shadow-xl animate-pulse " />
                    }
                  >
                    <div className="text-xl font-semibold mb-4 text-foreground">
                      <MarkdownHandler content={section.content} />
                    </div>
                  </Suspense>
                  {section.subsections?.map((sub) => (
                    <Suspense
                      key={sub.id}
                      fallback={
                        <div className="bg-muted rounded-lg p-6 shadow-xl animate-pulse " />
                      }
                    >
                      <div className="ml-4 mb-4 p-4 bg-muted rounded-lg">
                        <div className="font-medium text-foreground mb-2">
                          <MarkdownHandler content={sub.title} />
                        </div>
                        <div className="text-secondary-foreground prose prose-invert max-w-none">
                          <MarkdownHandler content={sub.description} />
                        </div>
                      </div>
                    </Suspense>
                  ))}
                </div>
              ))}

              {osszegzes?.content && (
                <div className="bg-secondary rounded-lg p-6 border border-transparent hover:border-border transition-colors">
                  <h2 className="text-2xl font-bold mb-4 text-foreground">
                    Összegzés
                  </h2>
                  <div className="text-foreground prose prose-invert max-w-none whitespace-pre-wrap">
                    <MarkdownHandler content={osszegzes.content} />
                  </div>
                </div>
              )}
              <Link
                to="/tetelek/$id"
                params={{ id: tetelId.toString() }}
                className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Vissza a tétel áttekintéséhez"
                title="Vissza a tételhez"
              >
                <FaArrowLeft className="mr-2" aria-hidden="true" />
                Vissza
              </Link>
            </div>

            {/* Delete Modal */}
            <DeleteModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onDelete={() => deleteMutation.mutate()}
              isDeleting={deleteMutation.isPending}
              itemName={tetel.name}
            />
          </PageTransition>

          {/* Floating Action Buttons */}
          {isAuthenticated && (
            <>
              <Link
                to="/tetelek/$id/details/edit"
                params={{ id: tetelId.toString() }}
                className="fixed bottom-22 right-7 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center z-50"
                title="Szerkeszd a tételt"
                aria-label="Szerkeszd a tételt"
              >
                <FaPen size={20} aria-hidden="true" />
              </Link>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    toast.error("Ehhez be kell jelentkezned!");
                    return;
                  }
                  setIsDeleteModalOpen(true);
                }}
                className="fixed bottom-7 right-7 p-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all transform hover:scale-105 flex items-center hover:cursor-pointer justify-center z-50"
                title="Töröld a tételt"
                aria-label="Töröld a tételt"
              >
                <FaTrash size={20} aria-hidden="true" />
              </button>
            </>
          )}
        </main>
      </Suspense>
    </>
  );
}
