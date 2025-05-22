import React from "react";
import { FaPlus } from "react-icons/fa";
import SectionBlock from "./SectionBlock";
import type { Section, Subsection } from "../../../api/types";
import PageTransition from "../PageTransition";
import { HiChevronDown } from "react-icons/hi";

interface SectionsListProps {
  sections: Section[];
  openSections: Record<number, boolean>;
  setOpenSections: (value: Record<number, boolean>) => void;
  addSection: () => void;
  removeSection: (id: number) => void;
  updateSection: (id: number, content: string) => void;
  addSub: (id: number) => void;
  updateSub: (
    sid: number,
    idx: number,
    field: keyof Subsection,
    val: string
  ) => void;
  removeSub: (sid: number, idx: number) => void;
  fieldErrors: Record<string, string>;
  showSectionErrors: boolean;
}

const SectionsList: React.FC<SectionsListProps> = ({
  sections,
  openSections,
  setOpenSections,
  addSection,
  removeSection,
  updateSection,
  addSub,
  updateSub,
  removeSub,
  fieldErrors,
  showSectionErrors,
}) => (
  <div className="space-y-4">
    {sections.map((sec, i) => {
      const isOpen = openSections[sec.id!];
      const errs: Record<string, string> = {};
      Object.entries(fieldErrors).forEach(([k, m]) => {
        if (k.startsWith(`sections.${i}.`)) {
          errs[k.replace(`sections.${i}.`, "")] = m;
        }
      });
      return (
        <div key={sec.id}>
          <button
            type="button"
            className="w-full flex justify-between p-4 bg-secondary rounded-md hover:cursor-pointer"
            onClick={() =>
              setOpenSections({ ...openSections, [sec.id!]: !isOpen })
            }
          >
            <span className="font-medium">Szekció #{i + 1}</span>
            <HiChevronDown
              className={`transform transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              size={30}
            />
          </button>
          <PageTransition show={isOpen}>
            <div className="p-4 border border-border rounded-b-md">
              <SectionBlock
                index={i}
                section={sec}
                onUpdateContent={(v) => updateSection(sec.id!, v)}
                onAddSubsection={() => addSub(sec.id!)}
                onRemoveSection={() => removeSection(sec.id!)}
                onUpdateSubsection={(idx, f, v) =>
                  updateSub(sec.id!, idx, f, v)
                }
                onRemoveSubsection={(idx) => removeSub(sec.id!, idx)}
                errors={showSectionErrors ? errs : {}}
              />
            </div>
          </PageTransition>
        </div>
      );
    })}
    <div className="flex items-center space-x-2 text-emerald-600">
      <button
        type="button"
        onClick={addSection}
        className="flex items-center justify-center p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 hover:cursor-pointer"
      >
        <FaPlus size={15} />
      </button>
      <span>Új Szekció</span>
    </div>
  </div>
);

export default SectionsList;
