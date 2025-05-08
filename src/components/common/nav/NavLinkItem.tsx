import type { FC } from "react";
import { Link, useMatchRoute } from "@tanstack/react-router";

import { Menu, Disclosure, Transition } from "@headlessui/react";
import { HiChevronDown } from "react-icons/hi";

export interface NavChild {
  name: string;
  to: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
}

export interface NavLink {
  name: string;
  to: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  children?: NavChild[];
}

interface Props {
  link: NavLink;
}

const NavLinkItem: FC<Props> = ({ link }) => {
  const matchRoute = useMatchRoute();
  const isActive = matchRoute({ to: link.to, fuzzy: true });
  const Icon = link.icon;

  const navLinkStyle: React.CSSProperties = {
    position: "relative",
    transition: "all 0.3s ease-in-out",
    padding: "0.5rem 0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  };

  if (!link.children) {
    return (
      <Link
        to={link.to}
        className={`transition-all duration-300 flex items-center gap-2 ${
          isActive ? "underline" : "hover:underline"
        }`}
        style={{
          ...navLinkStyle,
          color: isActive ? "var(--color-primary)" : "var(--color-foreground)",
          fontWeight: isActive ? "bold" : "normal",
        }}
      >
        <Icon width={16} height={16} />
        {link.name}
      </Link>
    );
  }

  const isAnyChildActive = link.children.some((child) =>
    matchRoute({ to: child.to, fuzzy: true })
  );

  return (
    <Menu as="div" className="relative">
      <div className="flex items-center">
        <Link
          to={link.to}
          className={`transition-all duration-300 flex items-center gap-2 ${
            isActive ? "underline" : "hover:underline"
          }`}
          style={{
            ...navLinkStyle,
            color: isActive
              ? "var(--color-primary)"
              : "var(--color-foreground)",
            fontWeight: isActive ? "bold" : "normal",
          }}
        >
          <Icon width={16} height={16} />
          {link.name}
        </Link>

        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button
                className={`ml-1 p-1 bg-muted rounded-full hover:cursor-pointer transition-colors ${
                  isAnyChildActive ? "text-primary" : ""
                }`}
              >
                <HiChevronDown
                  width={20}
                  height={20}
                  className={`w-5 h-5 transform transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Disclosure.Button>

              {/* fade-in/out on the panel */}
              <Transition
                show={open}
                enter="transition-opacity duration-200 ease-out"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150 ease-in"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                as="div"
              >
                <Disclosure.Panel className="absolute mt-2 right-0 top-10 max-w-max rounded-md shadow-lg bg-muted border border-border z-50">
                  {(link.children ?? []).map((child) => {
                    const childActive = matchRoute({
                      to: child.to,
                      fuzzy: true,
                    });
                    const ChildIcon = child.icon;
                    return (
                      <Menu.Item key={child.to}>
                        {({ active }) => (
                          <Link
                            to={child.to}
                            className={`flex items-center hover:bg-secondary gap-2 px-4 py-2 text-sm transition ${
                              childActive
                                ? "underline font-bold text-primary"
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
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
      </div>
    </Menu>
  );
};

export default NavLinkItem;
