import { Tab } from "@headlessui/react";
import { FiX } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <div
    className={`w-40 py-6 px-2 space-y-4 bg-secondary transition-all duration-300 transform lg:h-[93dvh] border-r-1 border-border h-full fixed z-40 top-0 lg:relative ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0`}
  >
    <div className="lg:hidden flex justify-end mb-4">
      <button
        className="text-foreground bg-muted md:mt-0 mt-10 p-1 rounded"
        onClick={onClose}
        aria-label="Close menu"
      >
        <FiX size={24} style={{ strokeWidth: 3 }} />
      </button>
    </div>

    <Tab.List className="space-y-4">
      <Tab
        className={({ selected }) =>
          `block w-full px-4 py-4 text-base font-medium text-left transition-colors rounded hover:cursor-pointer hover:underline ${
            selected
              ? "bg-muted text-primary font-bold underline"
              : "text-secondary-foreground hover:bg-muted"
          }`
        }
      >
        Rólam
      </Tab>
      <Tab
        className={({ selected }) =>
          `block w-full px-4 py-4 text-base font-medium text-left transition-colors rounded hover:cursor-pointer hover:underline ${
            selected
              ? "bg-muted text-primary font-bold underline"
              : "text-secondary-foreground hover:bg-muted"
          }`
        }
      >
        Jelszó módosítása
      </Tab>
    </Tab.List>
  </div>
);

export default Sidebar;
