import { Link, useMatchRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface SidebarLink {
  to: string;
  label: string;
  icon?: ReactNode; // ✅ Allow React Icon
  params?: Record<string, string>;
}

interface SidebarProps {
  links: SidebarLink[];
}

export default function Sidebar({ links }: SidebarProps) {
  const matchRoute = useMatchRoute();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden mt-13 md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-33 bg-secondary/20 border-r border-border pr-6 py-6 pl-4 z-40">
        <nav className="flex flex-col items-start gap-4">
          {links.map(({ to, label, icon, params }) => {
            const isBackLink = to.endsWith("/$id") || to === "/tetelek/$id";
            const active = matchRoute({
              to,
              params,
              fuzzy: !isBackLink,
            });
            return (
              <Link
                key={to}
                to={to}
                params={params}
                aria-label={`Navigate to ${label}`}
                title={`Go to ${label}`}
                className={`flex items-center gap-2 pl-0 pr-3 py-2 rounded-md text-md font-medium text-center transition-all transform ${
                  active
                    ? "text-primary underline font-semibold "
                    : "text-foreground hover:underline"
                }`}
              >
                {icon && <span aria-hidden="true">{icon}</span>}
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-[100dvw] bg-secondary/20 border-t border-border flex justify-around items-center px-3 py-4 h-12 z-50">
        {links.map(({ to, label, icon, params }) => {
          const isBackLink = to.endsWith("/$id") || to === "/tetelek/$id";
          const active = matchRoute({
            to,
            params,
            fuzzy: !isBackLink,
          });
          return (
            <Link
              key={to}
              to={to}
              params={params}
              aria-label={`Navigate to ${label}`}
              title={`Go to ${label}`}
              className={`flex flex-col items-center text-sm font-medium ${
                active
                  ? "text-primary underline"
                  : "text-foreground hover:underline"
              }`}
            >
              {icon && <span aria-hidden="true">{icon}</span>}
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
