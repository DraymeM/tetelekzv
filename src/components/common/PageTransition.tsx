import { Fragment, type FC, type ReactNode } from "react";
import { Transition } from "@headlessui/react";

interface PageTransitionProps {
  show?: boolean;
  children: ReactNode;
}

const PageTransition: FC<PageTransitionProps> = ({ show = true, children }) => (
  <Transition
    appear
    show={show}
    as={Fragment}
    enter="transition ease-out duration-300"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="transition ease-in duration-200"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
  >
    <div className="w-full h-full">{children}</div>
  </Transition>
);

export default PageTransition;
