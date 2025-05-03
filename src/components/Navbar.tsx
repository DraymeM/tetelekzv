import type { FC } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Menu } from "@headlessui/react";
import { GiSpinningSword, GiCardPick } from "react-icons/gi";
import { FaScroll, FaSignInAlt, FaUser } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { name: "Tételek", to: "/tetelek", icon: FaScroll },
  { name: "FlashCards", to: "/flashcards", icon: GiCardPick },
  { name: "Felelet Választós", to: "/mchoiceq", icon: MdQuiz },
];

const Navbar: FC = () => {
  const matchRoute = useMatchRoute();
  const { isAuthenticated } = useAuth();

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
    <nav className="fixed top-0 w-full mb-10 h-16 bg-gray-800 text-white flex items-center px-6 z-50 shadow shadow-gray-800 border-b-2 border-gray-700">
      <div className="flex items-center w-full justify-between">
        <Link
          to="/"
          className={`flex items-center text-3xl font-semibold transition-all duration-300 ${
            isHomeActive
              ? "text-emerald-400 underline"
              : "text-white hover:text-gray-200 hover:underline"
          }`}
          style={{
            ...navLinkStyle,
            color: isHomeActive ? "#3498db" : "var(--text-color)",
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
                  isActive
                    ? "text-yellow-400 underline"
                    : "hover:text-gray-200 hover:underline"
                }`}
                style={{
                  ...navLinkStyle,
                  color: isActive ? "#3498db" : "var(--text-color)",
                  fontWeight: isActive ? "bold" : "normal",
                }}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
          {isAuthenticated ? (
            <Link
              to="/auth/profile"
              className="transition-all duration-300 flex items-center gap-2 bg-teal-800 rounded-full hover:text-gray-200 hover:underline"
              style={navLinkStyle}
            >
              <FaUser size={20} />
              Profil
            </Link>
          ) : (
            <Link
              to="/login"
              className="transition-all duration-300 flex items-center gap-2 bg-teal-800 rounded-full hover:text-gray-200 hover:underline"
              style={navLinkStyle}
            >
              <FaSignInAlt size={20} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu */}
        <Menu as="div" className="relative md:hidden">
          <Menu.Button className="text-white p-1 rounded-md hover:bg-gray-800 hover:cursor-pointer border-gray-400 border-2 transition-colors duration-300">
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

          <Menu.Items className="absolute right-0 w-48 bg-gray-800 text-white border-gray-400 border-2 mt-2 shadow-lg transition-all transform scale-95 hover:scale-100">
            {navLinks.map((link) => {
              const isActive = matchRoute({ to: link.to, fuzzy: true });
              const Icon = link.icon;
              return (
                <Menu.Item key={link.to}>
                  {({ active }) => (
                    <Link
                      to={link.to}
                      className={` px-6 py-3 text-lg font-semibold transition duration-200 flex items-center gap-2 ${
                        isActive
                          ? "text-emerald-400 underline"
                          : active
                            ? "bg-gray-700"
                            : "hover:bg-gray-600"
                      }`}
                    >
                      <Icon size={20} />
                      {link.name}
                    </Link>
                  )}
                </Menu.Item>
              );
            })}
            <Menu.Item>
              {({ active }) => (
                <Link
                  to={isAuthenticated ? "/auth/profile" : "/login"}
                  className={`px-6 py-3 text-lg font-semibold transition duration-200 flex items-center gap-2 ${
                    active ? "bg-gray-700" : "hover:bg-gray-600"
                  }`}
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
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
