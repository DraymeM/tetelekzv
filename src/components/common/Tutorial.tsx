import { useEffect, useState } from "react";
import { IoArrowUndoSharp } from "react-icons/io5";

const Tutorial = ({
  open,
  onClose,
  steps,
}: {
  open: boolean;
  onClose: () => void;
  steps: {
    title: string;
    content: string;
    selector: string;
  }[];
}) => {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const margin = 10;
  const modalWidth = 320;
  const modalHeight = 140;
  const iconSize = 50;

  useEffect(() => {
    if (!open) {
      setStep(0);
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(steps[step]?.selector || "");
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [step, open, steps]);

  if (!open || !targetRect) return null;

  const spaceAbove = targetRect.top;

  let modalTop = 0;
  let pointerDirection: "down" | "up" = "down";

  if (spaceAbove > modalHeight + iconSize + margin) {
    modalTop = targetRect.top - margin - modalHeight - iconSize;
    pointerDirection = "down";
  } else {
    modalTop = targetRect.bottom + margin + iconSize;
    pointerDirection = "up";
  }

  let modalLeft = targetRect.left;
  if (modalLeft + modalWidth > window.innerWidth - margin) {
    modalLeft = window.innerWidth - modalWidth - margin;
  }
  if (modalLeft < margin) modalLeft = margin;

  let pointerLeft =
    targetRect.left + targetRect.width / 2 - modalLeft - iconSize / 2;
  pointerLeft = Math.min(
    Math.max(pointerLeft, iconSize),
    modalWidth - iconSize * 2
  );

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    pointerEvents: "auto",
    zIndex: 99998,
    clipPath: `polygon(
      0 0,
      100% 0,
      100% 100%,
      0 100%,
      0 0,
      ${targetRect.left}px ${targetRect.top}px,
      ${targetRect.right}px ${targetRect.top}px,
      ${targetRect.right}px ${targetRect.bottom}px,
      ${targetRect.left}px ${targetRect.bottom}px,
      ${targetRect.left}px ${targetRect.top}px
    )`,
  };

  return (
    <>
      {/* Overlay */}
      <div style={overlayStyle} aria-hidden="true" />

      {/* Modal */}
      <div
        className="fixed z-[99999] w-[320px] rounded-xl bg-secondary text-foreground shadow-2xl p-4 font-sans"
        style={{
          top: modalTop,
          left: modalLeft,
        }}
      >
        <h3 className="text-lg font-bold mb-2">{steps[step].title}</h3>
        <p className="text-sm mb-4">{steps[step].content}</p>

        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-rose-700 hover:bg-rose-800 text-sm"
          >
            Kilépés
          </button>

          <div className="flex gap-2">
            <button
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              className={`px-3 py-1 rounded text-sm border border-gray-500 ${
                step === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-muted hover:cursor-pointer"
              }`}
            >
              Előző
            </button>
            <button
              onClick={() => {
                if (step === steps.length - 1) onClose();
                else setStep((s) => s + 1);
              }}
              className="px-3 py-1 rounded hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              {step === steps.length - 1 ? "Befejezés" : "Következő"}
            </button>
          </div>
        </div>
      </div>

      {/* Arrow Icon */}
      <div
        className={`fixed z-[99999] text-foreground  ${
          pointerDirection === "down" ? "-rotate-90" : "rotate-90"
        }`}
        style={{
          top:
            pointerDirection === "down"
              ? modalTop + modalHeight
              : modalTop - iconSize,
          left: modalLeft + pointerLeft,
          fontSize: `${iconSize}px`,
        }}
      >
        <IoArrowUndoSharp size={iconSize} />
      </div>
    </>
  );
};
export default Tutorial;
