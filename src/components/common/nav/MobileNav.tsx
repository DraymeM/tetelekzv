import type { FC } from "react";
import { Menu } from "@headlessui/react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { FaUser, FaSignInAlt, FaMoon, FaSun } from "react-icons/fa";
import type { NavLink } from "./NavLinkItem";

interface Props {
  navLinks: NavLink[];
  theme: string;
  toggleTheme: () => void;
  isAuthenticated: boolean;
}

const MobileNav: FC<Props> = ({
  navLinks,
  theme,
  toggleTheme,
  isAuthenticated,
}) => {
  const matchRoute = useMatchRoute();

  return (
    <Menu as="div" className="relative md:hidden">
      <button
        onClick={toggleTheme}
        className="mr-4 p-2 rounded-full transition-colors border border-border text-foreground bg-muted"
        title="Toggle theme"
      >
        {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
      </button>
      <Menu.Button className="p-1 rounded-md border-2 transition-colors duration-300 text-foreground border-border">
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
      <Menu.Items className="absolute right-0 w-56 mt-2 border-2 shadow-lg transition-all transform bg-muted text-foreground z-50">
        {navLinks.map((link) => {
          const isActive = matchRoute({ to: link.to, fuzzy: true });
          const Icon = link.icon;
          return (
            <div key={link.to}>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to={link.to}
                    className={`px-6 py-3 text-lg font-semibold flex items-center gap-2 ${
                      isActive
                        ? "underline text-primary font-bold"
                        : active
                          ? "bg-secondary"
                          : ""
                    }`}
                  >
                    <Icon width={16} height={16} />
                    {link.name}
                  </Link>
                )}
              </Menu.Item>
              {link.children?.map((child) => {
                const childActive = matchRoute({ to: child.to, fuzzy: true });
                const ChildIcon = child.icon;
                return (
                  <Menu.Item key={child.to}>
                    {({ active }) => (
                      <Link
                        to={child.to}
                        className={`px-6 py-2 text-md flex items-center gap-2 ml-6 whitespace-nowrap ${
                          childActive
                            ? "underline text-primary font-bold"
                            : active
                              ? "bg-secondary"
                              : ""
                        }`}
                      >
                        <ChildIcon width={16} height={16} />
                        {child.name}
                      </Link>
                    )}
                  </Menu.Item>
                );
              })}
            </div>
          );
        })}

        <Menu.Item>
          {({ active }) => {
            const authPath = isAuthenticated ? "/auth/profile" : "/login";
            const isAuthActive = matchRoute({ to: authPath, fuzzy: true });
            return (
              <Link
                to={authPath}
                className={`px-6 py-3 text-lg font-semibold transition duration-200 flex items-center gap-2 ${
                  isAuthActive
                    ? "underline text-primary"
                    : active
                      ? "bg-secondary"
                      : ""
                }`}
              >
                {isAuthenticated ? (
                  <FaUser width={16} height={16} />
                ) : (
                  <FaSignInAlt width={16} height={16} />
                )}
                {isAuthenticated ? "Profil" : "Login"}
              </Link>
            );
          }}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default MobileNav;
