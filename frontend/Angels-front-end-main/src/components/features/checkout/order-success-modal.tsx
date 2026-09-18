import { CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface OrderSuccessModalProps {
  open: boolean;
  onContinue: () => void;
}

export function OrderSuccessModal({ open, onContinue }: OrderSuccessModalProps) {
  return (
    <Modal open={open} onClose={onContinue} className="text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-sage-500" />
      <h2 className="mt-4 font-display text-3xl text-cocoa-900">
        Order Successful!
      </h2>
      <p className="mt-2 text-sm text-cocoa-900/60">
        Thanks for your order — we'll start baking right away.
      </p>
      <Button onClick={onContinue} className="mt-6 w-full">
        Continue
      </Button>
    </Modal>
  );
}