import { useState } from "react";
import type { Section, Subsection } from "../api/types";

let nextClientId = Date.now();

function makeSection(s?: Section): Section {
  return s && s.id != null
    ? s
    : {
        id: ++nextClientId,
        content: s?.content ?? "",
        subsections:
          s?.subsections?.map((sub) => ({
            id: ++nextClientId,
            title: sub.title,
            description: sub.description,
          })) ?? [],
      };
}

export function useSections(initialSections?: Section[]) {
  const [sections, setSections] = useState<Section[]>(
    initialSections?.map(makeSection) ?? [makeSection()]
  );

  const addSection = (): Section => {
    const sec = makeSection();
    setSections((s) => [...s, sec]);
    return sec;
  };

  const removeSection = (id: number) =>
    setSections((s) => s.filter((x) => x.id !== id));

  const updateSection = (id: number, content: string) =>
    setSections((s) => s.map((x) => (x.id === id ? { ...x, content } : x)));

  const addSub = (id: number) =>
    setSections((s) =>
      s.map((sec) =>
        sec.id === id
          ? {
              ...sec,
              subsections: [
                ...sec.subsections,
                { id: ++nextClientId, title: "", description: "" },
              ],
            }
          : sec
      )
    );

  const updateSub = (
    sid: number,
    idx: number,
    field: keyof Subsection,
    val: string
  ) =>
    setSections((s) =>
      s.map((sec) =>
        sec.id === sid
          ? {
              ...sec,
              subsections: sec.subsections.map((sub, i) =>
                i === idx ? { ...sub, [field]: val } : sub
              ),
            }
          : sec
      )
    );

  const removeSub = (sid: number, idx: number) =>
    setSections((s) =>
      s.map((sec) =>
        sec.id === sid
          ? {
              ...sec,
              subsections: sec.subsections.filter((_, i) => i !== idx),
            }
          : sec
      )
    );

  return {
    sections,
    addSection,
    removeSection,
    updateSection,
    addSub,
    updateSub,
    removeSub,
  };
}
