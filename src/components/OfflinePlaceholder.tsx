// src/components/OfflineModal.tsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";
import { Link } from "@tanstack/react-router";

const OfflinePlaceholder: React.FC = () => {
  const [open] = useState(true);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          // Modal can't be closed manually
        }}
      >
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
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <MdOutlineSignalWifiStatusbarConnectedNoInternet4
                    size={64}
                    className="text-orange-500 animate-pulse"
                    aria-hidden="true"
                  />
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-3xl font-semibold text-center text-orange-500 mb-2"
                >
                  Nincs internetkapcsolat
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-center text-muted-foreground mb-2">
                    Ez a tartalom offline módban nem érhető el.
                  </p>
                  <p className="text-secondary-foreground text-sm text-center mb-4">
                    Menj vissza a kezdőlapra, ahol elérheted az előzőleg
                    betöltött tartalmakat.
                  </p>
                  <div className="flex justify-center">
                    <Link
                      to="/"
                      className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                    >
                      Vissza a kezdőlapra
                    </Link>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OfflinePlaceholder;
