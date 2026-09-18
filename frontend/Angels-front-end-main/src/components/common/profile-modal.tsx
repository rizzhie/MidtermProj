import { useRef, useState, type FormEvent } from "react";
import { Camera, LogOut, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { readImageAsDataUrl } from "@/lib/image";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  onRequestLogout: () => void;
}

export function ProfileModal({
  open,
  onClose,
  onRequestLogout,
}: ProfileModalProps) {
  const { user, updateProfile } = useCustomerAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAvatarChange(file: File | undefined) {
    if (!file) return;
    setError(null);
    setMessage(null);
    try {
      setAvatar(await readImageAsDataUrl(file));
    } catch (err) {
      setError((err as Error).message || "Couldn't load that image.");
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({
        name,
        email,
        phone,
        address: address || null,
        avatar,
      });
      setMessage("Profile saved.");
    } catch (err) {
      setError((err as Error).message || "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  }

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Modal open={open} onClose={onClose} className="max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-cocoa-900">My Account</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-cocoa-900/60 transition-colors hover:bg-cream-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSave} className="mt-5 space-y-4">
        <div className="flex flex-col items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name || "Profile"}
              className="h-20 w-20 rounded-full object-cover ring-2 ring-caramel-500"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cocoa-900 font-display text-xl text-cream-50 ring-2 ring-caramel-500">
              {initials}
            </span>
          )}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <Camera className="h-4 w-4" /> Change photo
            </Button>
            {avatar && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAvatar(null)}
              >
                Remove
              </Button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleAvatarChange(e.target.files?.[0])}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-cocoa-900">Full name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-cocoa-900">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-cocoa-900">Phone</label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-cocoa-900">Address</label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Home or delivery address"
            rows={2}
            className="mt-1.5"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>

      <div className="mt-5 border-t border-cocoa-900/10 pt-4">
        <Button
          variant="outline"
          onClick={onRequestLogout}
          className="w-full border-red-500 text-red-600 hover:bg-red-500 hover:text-cream-50"
        >
          <LogOut className="h-4 w-4" /> Log out
        </Button>
      </div>
    </Modal>
  );
}