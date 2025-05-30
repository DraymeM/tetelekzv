import { Tab } from "@headlessui/react";
import { FiX } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <div
    className={`w-64 p-6 space-y-4 bg-secondary transition-all duration-300 transform lg:h-[95dvh] border-r-1 border-border mt-6 h-full fixed z-40 top-0 lg:relative ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } lg:translate-x-0`}
  >
    <div className="lg:hidden flex justify-end mt-4 mb-4">
      <button
        className="text-foreground bg-muted p-1 rounded"
        onClick={onClose}
        aria-label="Close menu"
      >
        <FiX size={24} style={{ strokeWidth: 3 }} />
      </button>
    </div>

    <Tab.List className="space-y-4">
      <Tab
        className={({ selected }) =>
          `block w-full px-4 py-4 text-xl font-medium text-center transition-colors rounded hover:cursor-pointer ${
            selected
              ? "bg-muted text-primary font-bold"
              : "text-secondary-foreground hover:bg-muted"
          }`
        }
      >
        Rólam
      </Tab>
      <Tab
        className={({ selected }) =>
          `block w-full px-4 py-4 text-xl font-medium transition-colors rounded text-center hover:cursor-pointer ${
            selected
              ? "bg-muted text-primary font-bold"
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
