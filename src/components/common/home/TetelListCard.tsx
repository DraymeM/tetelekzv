import { useState, useTransition } from "react";
import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTetelek } from "../../../api/repo";
import type { ITetel } from "../../../api/repo";
import { Disclosure } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { FaSpinner } from "react-icons/fa";

const TetelListCard: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Only enable the query when the list is opened
  const { data, isLoading, error } = useQuery<ITetel[]>({
    queryKey: ["tetelek"],
    queryFn: fetchTetelek,
    enabled: isOpen, // Fetch only when the list is opened
  });

  const firstSixTetelek = Array.isArray(data) ? data.slice(0, 6) : [];

  const handleDisclosureClick = () => {
    startTransition(() => {
      setIsOpen(!isOpen); // Toggle the open state within a transition
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <FaSpinner className="animate-spin text-blue-500 text-6xl" />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-gray-400 border-2">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          Tétel Lista
        </h3>
        <div className="h-0.5 bg-gray-400 w-full mb-4" />
      </div>

      <div className="px-6 pb-6">
        <p className="text-gray-400 mb-4">
          Az alapvető tételek listája, amelyek segítenek a vizsga
          felkészülésében. A témák alapján könnyedén kereshetsz.
        </p>

        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button
                className="flex items-center gap-2 text-gray-300 hover:text-gray-100 hover:cursor-pointer transition"
                onClick={handleDisclosureClick}
              >
                <span>{open ? "Lista bezárása" : "Lista megnyitása"}</span>
                <FaChevronDown
                  className={`h-4 w-4 transform transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="overflow-hidden transition-all duration-500 ease-in-out">
                <div
                  className="bg-gray-800 p-4 rounded-lg mt-4"
                  style={{ backgroundColor: "#2d3748" }}
                >
                  {isLoading || isPending ? (
                    <div className="flex justify-center">
                      <div
                        className="spinner-border text-primary"
                        style={{ width: "3rem", height: "3rem" }}
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : error instanceof Error ? (
                    <p className="text-red-400">Hiba: {error.message}</p>
                  ) : (
                    <ol className="pl-6 text-gray-300 space-y-2">
                      {firstSixTetelek.length > 0 ? (
                        firstSixTetelek.map((tétel, index) => (
                          <li key={tétel.id} className="hover:text-gray-100">
                            <span className="text-gray-400">{index + 1}. </span>
                            {tétel.name}
                          </li>
                        ))
                      ) : (
                        <li>Nincs elérhető tétel</li>
                      )}
                    </ol>
                  )}
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default TetelListCard;
