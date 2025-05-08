import type { FC } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { GiSpinningSword } from "react-icons/gi";
import { FaScroll, FaPlus } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { GiCardPick } from "react-icons/gi";
import { FaDice } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import DesktopNav from "./common/nav/DesktopNav";
import MobileNav from "./common/nav/MobileNav";
import type { NavLink } from "./common/nav/NavLinkItem";

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
    <nav className="fixed top-0 w-full mb-10 h-16 flex items-center px-6 z-50 bg-secondary border-b-2 border-border text-foreground shadow">
      <div className="flex items-center w-full justify-between">
        <Link
          to="/"
          className={`flex items-center text-3xl font-semibold transition-all duration-300 ${
            isHomeActive ? "underline" : "hover:underline"
          }`}
        >
          <GiSpinningSword size={25} />
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
