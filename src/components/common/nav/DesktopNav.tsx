import type { FC } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { FaSun, FaMoon, FaUser, FaSignInAlt } from "react-icons/fa";
import NavLinkItem from "./NavLinkItem";
import type { NavLink } from "./NavLinkItem";
interface Props {
  navLinks: NavLink[];
  theme: string;
  toggleTheme: () => void;
  isAuthenticated: boolean;
}

const DesktopNav: FC<Props> = ({
  navLinks,
  theme,
  toggleTheme,
  isAuthenticated,
}) => {
  const matchRoute = useMatchRoute();

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navLinks.map((link) => (
        <NavLinkItem key={link.to} link={link} />
      ))}

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full transition-colors hover:cursor-pointer bg-muted border border-border"
        title="Toggle theme"
      >
        {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
      </button>

      {/* Auth link */}
      {isAuthenticated ? (
        <Link
          to="/auth/profile"
          className={`transition-all duration-300 flex items-center gap-2 bg-muted border border-border rounded-full ${
            matchRoute({ to: "/auth/profile", fuzzy: true })
              ? "underline text-primary border-primary "
              : "hover:underline"
          }`}
          style={{ padding: "0.5rem 0.75rem" }}
        >
          <FaUser size={20} />
          Profil
        </Link>
      ) : (
        <Link
          to="/login"
          className={`transition-all duration-300 flex items-center gap-2 border border-border rounded-full bg-secondary ${
            matchRoute({ to: "/login", fuzzy: true })
              ? "underline text-primary border-primary"
              : "hover:underline"
          }`}
          style={{ padding: "0.5rem 0.75rem" }}
        >
          <FaSignInAlt size={20} />
          Login
        </Link>
      )}
    </div>
  );
};

export default DesktopNav;
