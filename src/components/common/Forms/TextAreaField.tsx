import React from "react";

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">
      {label}
    </label>
    <textarea
      rows={4}
      className={`w-full p-2 rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
        error ? "border border-red-500" : "border border-border"
      }`}
      value={value}
      onChange={onChange}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default TextAreaField;
