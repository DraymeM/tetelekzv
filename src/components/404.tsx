import React, { Fragment, Suspense, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import { GiSpinningRibbons } from "react-icons/gi";
import { FaHome } from "react-icons/fa"; // ⬅️ Import house icon

const NotFoundPage: React.FC = () => {
  const [open] = useState(true);

  return (
    <Suspense>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <div className="fixed" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-8 text-center">
              <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-secondary p-8  shadow-xl transition-all animate-fade-in">
                {/* Spinning Icon */}
                <div className="flex justify-center mb-6">
                  <GiSpinningRibbons
                    size={100}
                    className="text-6xl text-primary animate-spin"
                  />
                </div>

                <Dialog.Title
                  as="h3"
                  className="text-3xl font-bold mb-6 text-primary"
                >
                  404 - Az oldal nem található
                </Dialog.Title>

                <p className="text-lg mb-8">
                  The page you are looking for does not exist.
                </p>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 rounded-md  font-semibold shadow-lg hover:bg-teal-800 transition-colors"
                >
                  <FaHome className="text-lg" />
                  Főoldal
                </Link>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Suspense>
  );
};

export default NotFoundPage;
