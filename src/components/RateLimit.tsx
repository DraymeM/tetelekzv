// src/components/RateLimitExceeded.tsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaHourglassHalf } from "react-icons/fa";

const RateLimitExceeded: React.FC = () => {
  const [open] = useState(true);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-40"
          leave="ease-in duration-200"
          leaveFrom="opacity-40"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background" />
        </Transition.Child>

        {/* Modal panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-secondary p-6 text-left align-middle shadow-xl transition-all">
                {/* Hourglass Icon */}
                <div className="flex justify-center mb-4">
                  <FaHourglassHalf
                    size={64}
                    className="text-rose-500 animate-pulse"
                  />
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-semibold text-center text-rose-500 mb-2"
                >
                  429 – Túl sok kérés
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-center text-muted-foreground">
                    Túllépted a megengedett kérésszámot. Próbáld meg újra
                    később.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RateLimitExceeded;
