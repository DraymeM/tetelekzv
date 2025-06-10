import type { FC } from "react";
import React from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { FaScroll, FaPlus } from "react-icons/fa";
import { GiCardPick } from "react-icons/gi";
import { FaDice } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import type { NavLink } from "./nav/NavLinkItem";
const DesktopNav = React.lazy(() => import("./nav/DesktopNav"));
const MobileNav = React.lazy(() => import("./nav/MobileNav"));
const LogoIcon = React.lazy(() => import("./nav/LogoIcon"));

const navLinks: NavLink[] = [
  {
    name: "Tételek",
    to: "/tetelek",
    icon: FaScroll,
    children: [
      { name: "Tétel", to: "/tetelcreate", icon: FaPlus },
      { name: "FlashCards", to: "/flashcards", icon: GiCardPick },
      { name: "Random", to: "/mchoiceq", icon: FaDice },
    ],
  },
];

const Navbar: FC = () => {
  const matchRoute = useMatchRoute();
  const isHomeActive = matchRoute({ to: "/", fuzzy: true });
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 w-full mb-10 h-13 flex items-center px-6 z-50 bg-secondary border-b-2 border-border text-foreground shadow">
      <div className="flex items-center w-full mx-auto justify-between">
        <Link
          to="/"
          aria-label="Kezdőlap"
          title="Kezdőlap"
          className={`flex items-center hover:animate-pulse font-semibold transition-all duration-300 ${
            isHomeActive ? "text-primary" : "text-foreground"
          }`}
        >
          <LogoIcon className="w-6 h-6  mr-2" />
        </Link>

        <DesktopNav
          navLinks={navLinks}
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
        />

        <MobileNav
          navLinks={navLinks}
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </nav>
  );
};

export default Navbar;
