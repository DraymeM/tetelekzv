import React from "react";
import InputField from "./InputField";
import TextAreaField from "./TextAreaField";

interface TetelFormHeaderProps {
  name: string;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  osszegzes: string;
  handleOsszegzesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errorName?: string;
  errorOsszegzes?: string;
}

const TetelFormHeader: React.FC<TetelFormHeaderProps> = ({
  name,
  handleNameChange,
  osszegzes,
  handleOsszegzesChange,
  errorName,
  errorOsszegzes,
}) => (
  <div>
    <InputField
      label="Tétel címe"
      value={name}
      onChange={handleNameChange}
      error={errorName}
    />
    <TextAreaField
      label="Összegzés"
      value={osszegzes}
      onChange={handleOsszegzesChange}
      error={errorOsszegzes}
    />
  </div>
);

export default TetelFormHeader;
