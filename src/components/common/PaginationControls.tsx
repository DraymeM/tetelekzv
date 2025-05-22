import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { HiChevronDown, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const LIMIT_OPTIONS = [5, 15, 35, 50];

interface LimitDropdownProps {
  limit: number;
  setLimit: (limit: number) => void;
}

export function LimitDropdown({ limit, setLimit }: LimitDropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button className="inline-flex justify-center hover:cursor-pointer items-center rounded-md border border-border shadow-sm px-4 py-2 bg-secondary text-sm font-medium hover:bg-muted focus:outline-none">
            Limit: {limit}
            <HiChevronDown
              className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute hover:cursor-pointer right-0 z-10 mt-2 w-26 origin-top-right bg-secondary border border-border divide-y divide-muted rounded-md shadow-lg focus:outline-none">
              {LIMIT_OPTIONS.map((opt) => (
                <Menu.Item key={opt} as={Fragment}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-muted text-primary" : "text-foreground"
                      } block w-full text-center px-4 py-2 text-sm hover:cursor-pointer`}
                      onClick={() => setLimit(opt)}
                    >
                      {opt}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}

interface PaginationProps {
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  total: number;
  limit: number;
}

export function Pagination({ page, setPage, total, limit }: PaginationProps) {
  const pageCount = Math.ceil(total / limit);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(pageCount - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < pageCount - 2) {
      pages.push("...");
    }

    pages.push(pageCount);

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-6">
      <button
        className="p-2 rounded border bg-muted disabled:opacity-50 hover:cursor-pointer"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <HiChevronLeft size={17} />
      </button>

      {getPageNumbers().map((item, idx) =>
        typeof item === "number" ? (
          <button
            key={idx}
            onClick={() => setPage(item)}
            className={`px-3 py-1 rounded text-md hover:cursor-pointer ${
              page === item
                ? "bg-teal-600 text-white"
                : "border bg-muted hover:bg-muted/70"
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={idx} className="px-2 text-muted-foreground text-sm">
            {item}
          </span>
        )
      )}

      <button
        className="p-2 rounded border bg-muted disabled:opacity-50"
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        <HiChevronRight size={17} />
      </button>
    </div>
  );
}
