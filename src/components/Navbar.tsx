import type { FC } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Menu } from "@headlessui/react";
import { GiSpinningSword, GiCardPick } from "react-icons/gi";
import { FaScroll, FaSignInAlt, FaUser, FaSun, FaMoon } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

const navLinks = [
  { name: "Tételek", to: "/tetelek", icon: FaScroll },
  { name: "FlashCards", to: "/flashcards", icon: GiCardPick },
  { name: "Felelet Választós", to: "/mchoiceq", icon: MdQuiz },
];

const Navbar: FC = () => {
  const matchRoute = useMatchRoute();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinkStyle: React.CSSProperties = {
    position: "relative",
    transition: "all 0.3s ease-in-out",
    padding: "0.5rem 0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  };

  const isHomeActive = matchRoute({ to: "/", fuzzy: true });

  return (
    <nav className="fixed top-0 w-full mb-10 h-16 flex items-center px-6 z-50 bg-secondary border-b-2 border-border text-foreground shadow">
      <div className="flex items-center w-full justify-between">
        {/* Home link */}
        <Link
          to="/"
          className={`flex items-center text-3xl font-semibold transition-all duration-300 ${
            isHomeActive ? "underline" : "hover:underline"
          }`}
          style={{
            ...navLinkStyle,
            color: isHomeActive
              ? "var(--color-primary)"
              : "var(--color-foreground)",
            fontWeight: isHomeActive ? "bold" : "normal",
          }}
        >
          <div className="hover:animate-spin">
            <GiSpinningSword size={25} />
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => {
            const isActive = matchRoute({ to: link.to, fuzzy: true });
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`transition-all duration-300 flex items-center gap-2 ${
                  isActive ? "underline" : "hover:underline"
                }`}
                style={{
                  ...navLinkStyle,
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-foreground)",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className=" p-2 rounded-full transition-colors text-foreground boder-1 border-border bg-muted"
            title="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          {/* Auth link (Profile/Login) */}
          {isAuthenticated
            ? (() => {
                const isActive = matchRoute({
                  to: "/auth/profile",
                  fuzzy: true,
                });
                return (
                  <Link
                    to="/auth/profile"
                    className={`transition-all duration-300 flex items-center gap-2 rounded-full ${
                      isActive ? "underline" : "hover:underline"
                    }`}
                    style={{
                      ...navLinkStyle,
                      color: isActive
                        ? "var(--color-primary)"
                        : "var(--color-foreground)",
                      fontWeight: isActive ? "bold" : "normal",
                      backgroundColor: "var(--color-secondary)",
                    }}
                  >
                    <FaUser size={20} />
                    Profil
                  </Link>
                );
              })()
            : (() => {
                const isActive = matchRoute({ to: "/login", fuzzy: true });
                return (
                  <Link
                    to="/login"
                    className={`transition-all duration-300 flex items-center gap-2 rounded-full bg-secondary ${
                      isActive ? "underline" : "hover:underline"
                    }`}
                    style={{
                      ...navLinkStyle,
                      color: isActive
                        ? "var(--color-primary)"
                        : "var(--color-foreground)",
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    <FaSignInAlt size={20} />
                    Login
                  </Link>
                );
              })()}
        </div>

        {/* Mobile menu */}
        <Menu as="div" className="relative md:hidden">
          <button
            onClick={toggleTheme}
            className="mr-4 p-2 rounded-full transition-colors border-border border-1 text-foreground bg-muted"
            title="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>
          <Menu.Button className="p-1 rounded-md border-2 transition-colors duration-300 text-foreground border-border ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Menu.Button>

          <Menu.Items
            className="absolute right-0 w-48 mt-2 border-2 shadow-lg transition-all transform scale-95 hover:scale-100"
            style={{
              backgroundColor: "var(--color-background)",
              color: "var(--color-foreground)",
              borderColor: "var(--color-border)",
            }}
          >
            {navLinks.map((link) => {
              const isActive = matchRoute({ to: link.to, fuzzy: true });
              const Icon = link.icon;
              return (
                <Menu.Item key={link.to}>
                  {({ active }) => (
                    <Link
                      to={link.to}
                      className={`px-6 py-3 text-lg font-semibold transition duration-200 flex items-center gap-2 ${
                        isActive ? "underline" : active ? "bg-muted" : ""
                      }`}
                      style={{
                        color: isActive
                          ? "var(--color-primary)"
                          : "var(--color-foreground)",
                      }}
                    >
                      <Icon size={20} />
                      {link.name}
                    </Link>
                  )}
                </Menu.Item>
              );
            })}

            {/* Mobile auth button */}
            <Menu.Item>
              {({ active }) => {
                const authPath = isAuthenticated ? "/auth/profile" : "/login";
                const isAuthActive = matchRoute({ to: authPath, fuzzy: true });
                return (
                  <Link
                    to={authPath}
                    className={`px-6 py-3 text-lg font-semibold transition duration-200 flex items-center gap-2 ${
                      isAuthActive ? "underline" : active ? "bg-muted" : ""
                    }`}
                    style={{
                      color: isAuthActive
                        ? "var(--color-primary)"
                        : "var(--color-foreground)",
                    }}
                  >
                    {isAuthenticated ? (
                      <>
                        <FaUser size={20} />
                        Profil
                      </>
                    ) : (
                      <>
                        <FaSignInAlt size={20} />
                        Login
                      </>
                    )}
                  </Link>
                );
              }}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
