import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "@headlessui/react";

const navLinks = [{ name: "Tételek", to: "/tetelek" }];

const Navbar: FC = () => {
  return (
    <nav className="fixed top-0 w-full  mb-10 h-16 bg-blue-900 text-white flex items-center px-6 z-50 shadow-md">
      <div className="flex items-center w-full justify-between">
        <Link
          to="/"
          className="text-xl font-semibold hover:text-gray-200 transition-all duration-300"
        >
          Főoldal
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-gray-200 transition-all hover:font-underline duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <Menu as="div" className="relative md:hidden">
          <Menu.Button className="text-white p-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
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

          <Menu.Items className="absolute right-0 w-48 bg-gray-800 text-white mt-2 rounded-md shadow-lg transition-all transform scale-95 hover:scale-100">
            {navLinks.map((link) => (
              <Menu.Item key={link.to}>
                {({ active }) => (
                  <Link
                    to={link.to}
                    className={`block px-6 py-3 text-lg font-semibold transition duration-200 ${
                      active ? "bg-gray-700" : "hover:bg-gray-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
