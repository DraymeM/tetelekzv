import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface InputFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  enablePasswordToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  enablePasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="relative" id={id}>
        <input
          type={
            enablePasswordToggle ? (showPassword ? "text" : "password") : "text"
          }
          className={`w-full p-2 rounded bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
            error ? "border border-red-500" : "border border-border"
          } ${enablePasswordToggle ? "pr-10" : ""}`}
          value={value}
          onChange={onChange}
        />
        {enablePasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
