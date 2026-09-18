import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-center font-display text-2xl text-cocoa-900">
        Log out?
      </h2>
      <p className="mt-2 text-center text-sm text-cocoa-900/60">
        Are you sure you want to log out?
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button onClick={onConfirm} className="w-full">
          Yes
        </Button>
        <Button onClick={onClose} variant="secondary" className="w-full">
          No
        </Button>
      </div>
    </Modal>
  );
}