import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";

interface TetelCardProps {
  to: string;
  params: { id: string };
  icon: ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
  ariaLabel: string;
  titleText: string;
}

export default function TetelCard({
  to,
  params,
  icon,
  title,
  description,
  disabled = false,
  ariaLabel,
  titleText,
}: TetelCardProps) {
  return (
    <Link
      to={to}
      params={params}
      className={`relative h-48 bg-secondary rounded-lg p-6 shadow-xl border border-transparent hover:border-border transition-colors flex items-center justify-center ${
        disabled ? "opacity-50 pointer-events-none" : ""
      }`}
      aria-label={ariaLabel}
      title={titleText}
    >
      <div className="text-center text-primary">
        <h2 className="text-xl font-semibold text-primary mb-2 flex items-center justify-center">
          {icon}
          {title}
        </h2>
        <p className="text-secondary-foreground">{description}</p>
      </div>

      {/* Notch */}
      <div className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rounded w-16 h-1.5 bg-primary/50" />
    </Link>
  );
}
