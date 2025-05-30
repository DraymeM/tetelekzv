import {
  FaFire,
  FaBolt,
  FaCompass,
  FaFeatherAlt,
  FaCheck,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
export const RATING_ICONS = [
  {
    Icon: FaXmark,
    label: "Újra kell nézni",
    color: "text-red-600", // danger
  },
  {
    Icon: FaFire,
    label: "Nagyon nehéz",
    color: "text-orange-500", // intense
  },
  {
    Icon: FaBolt,
    label: "Nehéz",
    color: "text-yellow-500", // electric/challenge
  },
  {
    Icon: FaCompass,
    label: "Ment",
    color: "text-lime-600", // navigation/progress
  },
  {
    Icon: FaFeatherAlt,
    label: "Könnyű",
    color: "text-emerald-500", // lightness
  },
  {
    Icon: FaCheck,
    label: "Túl könnyű",
    color: "text-green-500", // mastery
  },
];
