import React from "react";
import { FaTimes } from "react-icons/fa";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

export interface Subsection {
  title: string;
  description: string;
}

export interface SubsectionBlockProps {
  subsection: Subsection;
  onUpdate: (field: keyof Subsection, value: string) => void;
  onRemove: () => void;
  errors?: Partial<Record<keyof Subsection, string>>;
}

const SubsectionBlock: React.FC<SubsectionBlockProps> = ({
  subsection,
  onUpdate,
  onRemove,
  errors = {},
}) => (
  <div className="space-y-2 relative group">
    <button
      type="button"
      onClick={onRemove}
      className="absolute -top-3 -right-3 text-red-500 bg-gray-900 rounded-full p-1 hover:bg-red-500/20 hover:cursor-pointer"
    >
      <FaTimes className="w-5 h-5" />
    </button>
    <InputField
      label="Cím"
      value={subsection.title}
      onChange={(e) => onUpdate("title", e.target.value)}
      error={errors.title}
    />
    <TextAreaField
      label="Leírás"
      value={subsection.description}
      onChange={(e) => onUpdate("description", e.target.value)}
      error={errors.description}
    />
  </div>
);

export default SubsectionBlock;
