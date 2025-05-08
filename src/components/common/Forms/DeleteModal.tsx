import { Dialog } from "@headlessui/react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  itemName: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  isDeleting,
  itemName,
}: DeleteModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-secondary p-6">
          <Dialog.Title className="text-xl font-bold text-foreground mb-4">
            Törlés
          </Dialog.Title>
          <div className="mb-6">
            <p className="text-forground">
              Biztosan törölni szeretnéd a(z) "{itemName}" Minden kapcsolódó
              adat végleg törlődni fog.
            </p>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-secondary-foreground hover:text-foreground"
              disabled={isDeleting}
            >
              Mégse
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-foreground rounded-md hover:bg-red-700 
                         disabled:bg-red-400 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {isDeleting ? "Törlés..." : "Törlés"}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
