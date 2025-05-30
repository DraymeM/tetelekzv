import { useEffect, useState, useRef } from "react";
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
    requiresInteraction?: boolean;
  }[];
}) => {
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [interactionComplete, setInteractionComplete] = useState(false);
  const interactionListenerRef = useRef<((e: MouseEvent) => void) | null>(null);

  const margin = 10;
  const modalWidth = 320;
  const modalHeight = 140;
  const iconSize = 50;

  // Prevent scrolling when tutorial is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setTargetRect(null);
      setInteractionComplete(false);
      return;
    }

    const currentStep = steps[step];
    const el = document.querySelector(currentStep?.selector || "");

    // Cleanup previous interaction listener
    if (interactionListenerRef.current) {
      document.removeEventListener("click", interactionListenerRef.current);
      interactionListenerRef.current = null;
    }

    // Reset interaction state based on step requirements
    setInteractionComplete(!currentStep?.requiresInteraction);

    if (el) {
      // Setup interaction listener if needed
      if (currentStep?.requiresInteraction) {
        const handleInteraction = (e: MouseEvent) => {
          if (el.contains(e.target as Node)) {
            setInteractionComplete(true);
          }
        };

        document.addEventListener("click", handleInteraction);
        interactionListenerRef.current = handleInteraction;
      }

      // Scroll to element
      el.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "center",
      });

      // Get position after scrolling
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }

    return () => {
      if (interactionListenerRef.current) {
        document.removeEventListener("click", interactionListenerRef.current);
      }
    };
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

  // Calculate overlay regions
  const regions = [
    {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: Math.max(0, targetRect.top),
    },
    {
      top: targetRect.top,
      left: 0,
      width: Math.max(0, targetRect.left),
      height: targetRect.height,
    },
    {
      top: targetRect.top,
      left: targetRect.right,
      width: Math.max(0, window.innerWidth - targetRect.right),
      height: targetRect.height,
    },
    {
      top: targetRect.bottom,
      left: 0,
      width: window.innerWidth,
      height: Math.max(0, window.innerHeight - targetRect.bottom),
    },
  ];

  return (
    <>
      {/* Render overlay regions */}
      {regions.map(
        (region, index) =>
          region.width > 0 &&
          region.height > 0 && (
            <div
              key={index}
              className="fixed bg-black/60 pointer-events-auto"
              style={{
                top: region.top,
                left: region.left,
                width: region.width,
                height: region.height,
              }}
            />
          )
      )}

      {/* Tutorial Modal */}
      <div
        className="fixed z-[99999] w-[320px] border-border border-2 rounded-xl bg-secondary text-foreground shadow-2xl p-4 font-sans"
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
            className="px-3 py-1 rounded text-white hover:cursor-pointer bg-rose-700 hover:bg-rose-800 text-sm"
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
              disabled={steps[step].requiresInteraction && !interactionComplete}
              className={`px-3 py-1 rounded text-white text-sm ${
                steps[step].requiresInteraction && !interactionComplete
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
              }`}
            >
              {step === steps.length - 1 ? "Befejezés" : "Következő"}
            </button>
          </div>
        </div>
      </div>

      {/* Arrow pointing to the element */}
      <div
        className={`fixed z-[99999] text-white mt-5  ${
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
