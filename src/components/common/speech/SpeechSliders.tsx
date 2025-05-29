import React from "react";

interface SpeechSlidersProps {
  rate: number;
  pitch: number;
  volume: number;
  onChange: (type: "rate" | "pitch" | "volume", value: number) => void;
}

const SpeechSliders: React.FC<SpeechSlidersProps> = ({
  rate,
  pitch,
  volume,
  onChange,
}) => {
  const sliderStyle = {
    accentColor: "var(--primary)",
    width: "100%",
  };

  return (
    <>
      {[
        {
          label: "Rate",
          value: rate,
          min: 0.5,
          max: 2,
          step: 0.1,
          type: "rate",
        },
        {
          label: "Pitch",
          value: pitch,
          min: 0,
          max: 2,
          step: 0.1,
          type: "pitch",
        },
        {
          label: "Volume",
          value: volume,
          min: 0,
          max: 1,
          step: 0.1,
          type: "volume",
        },
      ].map(({ label, value, type, ...rest }) => (
        <div key={type}>
          <label className="block text-sm font-medium mb-1 text-foreground">
            {label}: {value.toFixed(1)}
          </label>
          <input
            type="range"
            value={value}
            onChange={(e) => onChange(type as any, parseFloat(e.target.value))}
            style={sliderStyle}
            {...rest}
          />
        </div>
      ))}
    </>
  );
};
export default SpeechSliders;
