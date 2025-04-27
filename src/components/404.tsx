import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import { GiSpinningRibbons } from "react-icons/gi";
import { FaHome } from "react-icons/fa"; // ⬅️ Import house icon

const NotFoundPage: React.FC = () => {
  const [open, setOpen] = useState(true);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-8 text-center">
            <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-800 p-8 text-white shadow-xl transition-all animate-fade-in">
              {/* Spinning Icon */}
              <div className="flex justify-center mb-6">
                <GiSpinningRibbons
                  size={100}
                  className="text-6xl text-blue-500 animate-spin"
                />
              </div>

              <Dialog.Title
                as="h3"
                className="text-3xl font-bold mb-6 text-cyan-300"
              >
                404 - Az oldal nem található
              </Dialog.Title>

              <p className="text-lg mb-8">
                The page you are looking for does not exist.
              </p>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 rounded-md text-white font-semibold shadow-lg hover:bg-blue-400 transition-colors"
              >
                <FaHome className="text-lg" />
                Főoldal
              </Link>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NotFoundPage;
