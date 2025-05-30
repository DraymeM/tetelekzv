import type { FC } from "react";
import React, { Suspense } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { FaScroll, FaPlus } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { GiCardPick } from "react-icons/gi";
import { FaDice } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import type { NavLink } from "./common/nav/NavLinkItem";
const DesktopNav = React.lazy(() => import("./common/nav/DesktopNav"));
const MobileNav = React.lazy(() => import("./common/nav/MobileNav"));
const LogoIcon = React.lazy(() => import("./common/nav/LogoIcon"));

const navLinks: NavLink[] = [
  {
    name: "Tételek",
    to: "/tetelek",
    icon: FaScroll,
    children: [
      { name: "Tétel", to: "/tetelcreate", icon: FaPlus },
      { name: "FlashCards", to: "/flashcards", icon: GiCardPick },
    ],
  },
  {
    name: "Kérdések",
    to: "/mquestions",
    icon: MdQuiz,
    children: [
      { name: "Kérdés", to: "/pmchq", icon: FaPlus },
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
    <Suspense>
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
    </Suspense>
  );
};

export default Navbar;
