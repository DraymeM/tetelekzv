import React, { Suspense } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import TextAreaField from "./TextAreaField";
import type { Subsection } from "./SubsectionBlock";
import SubsectionBlock from "./SubsectionBlock";

export interface Section {
  content: string;
  subsections: Subsection[];
}

export interface SectionBlockProps {
  index: number;
  section: Section;
  onUpdateContent: (value: string) => void;
  onAddSubsection: () => void;
  onRemoveSection: () => void;
  onUpdateSubsection: (
    ssi: number,
    field: keyof Subsection,
    value: string
  ) => void;
  onRemoveSubsection: (ssi: number) => void;
  errors?: Record<string, string>;
}

const SectionBlock: React.FC<SectionBlockProps> = ({
  onUpdateContent,
  onAddSubsection,
  onRemoveSection,
  onUpdateSubsection,
  onRemoveSubsection,
  section,
  errors = {},
}) => (
  <Suspense>
    <div className="p-4 border rounded-lg border-border relative group">
      <button
        type="button"
        onClick={onRemoveSection}
        className="absolute -top-3 -right-3 text-red-500 bg-background rounded-full p-1 hover:bg-red-500/20 hover:cursor-pointer"
      >
        <FaTimes className="w-5 h-5" />
      </button>

      <TextAreaField
        label="Szekció tartalma"
        value={section.content}
        onChange={(e) => onUpdateContent(e.target.value)}
        error={errors.content}
      />

      <div className="mt-4 space-y-3">
        <h4 className="text-md font-medium text-foreground">Alszekciók</h4>

        {section.subsections.map((sub, idx) => (
          <SubsectionBlock
            key={idx}
            subsection={sub}
            onRemove={() => onRemoveSubsection(idx)}
            onUpdate={(field, value) => onUpdateSubsection(idx, field, value)}
            errors={{
              title: errors[`subsections.${idx}.title`],
              description: errors[`subsections.${idx}.description`],
            }}
          />
        ))}

        {/* single “Add Subsection” button below all existing subsections */}
        <div className="flex items-center space-x-2 text-emerald-600">
          <button
            type="button"
            onClick={onAddSubsection}
            className="flex items-center justify-center p-2 rounded-full bg-emerald-600 hover:cursor-pointer text-white hover:bg-emerald-700"
          >
            <FaPlus size={15} />
          </button>
          <span>Új Alszekció</span>
        </div>
      </div>
    </div>
  </Suspense>
);

export default SectionBlock;
