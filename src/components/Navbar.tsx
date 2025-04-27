import type { FC } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { Menu } from "@headlessui/react";
import { GiSpinningSword, GiCardPick } from "react-icons/gi";
import { FaScroll } from "react-icons/fa"; // Added new icon for 'Tételek'
import { MdQuiz } from "react-icons/md";

const navLinks = [
  { name: "Tételek", to: "/tetelek", icon: FaScroll },
  { name: "FlashCards", to: "/flashcards", icon: GiCardPick },
  { name: "Felelet Választós", to: "/mchoiceq", icon: MdQuiz },
];

const Navbar: FC = () => {
  const matchRoute = useMatchRoute();

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
    <nav className="fixed top-0 w-full mb-10 h-16 bg-gray-700 text-white flex items-center px-6 z-50 shadow shadow-gray-500">
      <div className="flex items-center w-full justify-between">
        <Link
          to="/"
          className={`flex items-center text-3xl font-semibold transition-all duration-300 ${
            isHomeActive
              ? "text-blue-400 underline"
              : "text-white hover:text-gray-200 hover:underline"
          }`}
          style={{
            ...navLinkStyle,
            color: isHomeActive ? "#3498db" : "var(--text-color)",
            fontWeight: isHomeActive ? "bold" : "normal",
          }}
        >
          <div className="hover:animate-spin">
            <GiSpinningSword size={35} />
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
        </div>

        {/* Mobile menu */}
        <Menu as="div" className="relative md:hidden">
          <Menu.Button className="text-white p-2 rounded-md hover:bg-gray-800 hover:cursor-pointer border-gray-400 border-2 transition-colors duration-300">
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
                          ? "text-blue-400 underline"
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
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
