import { useState, useTransition } from "react";
import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { Disclosure } from "@headlessui/react";
import { FaChevronDown, FaSpinner, FaListUl } from "react-icons/fa";
import { fetchTetelek } from "../../../api/repo";
import type { Tetel } from "../../../api/types";
const TetelListCard: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { data, isLoading, error } = useQuery<Tetel[], Error>({
    queryKey: ["tetelek"],
    queryFn: fetchTetelek,
  });

  const firstThreeTetelek = Array.isArray(data) ? data.slice(0, 3) : [];

  const handleDisclosureClick = () => {
    startTransition(() => {
      setIsOpen(!isOpen);
    });
  };

  return (
    <div className="bg-secondary shadow-md rounded-lg overflow-hidden transition duration-300 border-transparent hover:border-border border-2">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-primary mb-2 flex items-center gap-2">
          <FaListUl size={24} />
          Tétel Lista
        </h3>
        <div className="h-0.5 bg-border w-full mb-4" />
      </div>

      <div className="px-6 pb-6">
        <p className="text-foreground mb-4">
          Az alapvető tételek listája, amelyek segítenek a vizsga
          felkészülésében. A témák alapján könnyedén kereshetsz.
        </p>

        <Disclosure>
          {({ open }) => (
            <div>
              <Disclosure.Button
                className="flex items-center gap-2 text-secondary-foreground hover:text-foreground hover:cursor-pointer transition"
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
                <div className="bg-muted p-4 rounded-lg mt-4">
                  {isLoading || isPending ? (
                    <div className="flex justify-center">
                      <FaSpinner className="animate-spin text-primary text-4xl" />
                    </div>
                  ) : error ? (
                    <p className="text-red-400">Hiba: {error.message}</p>
                  ) : (
                    <ol className="pl-6 text-foreground0 space-y-2">
                      {firstThreeTetelek.length > 0 ? (
                        firstThreeTetelek.map((tétel, index) => (
                          <li key={tétel.id} className="hover:text-foreground">
                            <span className="text-secondary-foreground">
                              {index + 1}.{" "}
                            </span>
                            {tétel.name}
                          </li>
                        ))
                      ) : (
                        <li>Nincs elérhető tétel</li>
                      )}
                    </ol>
                  )}
                  <p>...</p>
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
