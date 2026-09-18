import { Link } from "react-router-dom";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function AuthPromptModal({
  open,
  onClose,
  title = "Sign in to continue",
  message = "Please log in or create an account to continue.",
}: AuthPromptModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-center font-display text-2xl text-cocoa-900">
        {title}
      </h2>
      <p className="mt-2 text-center text-sm text-cocoa-900/60">{message}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button
          as={Link}
          to="/login"
          onClick={onClose}
          variant="outline"
          className="w-full"
        >
          Log in
        </Button>
        <Button as={Link} to="/signup" onClick={onClose} className="w-full">
          Sign up
        </Button>
      </div>
    </Modal>
  );
}