import { MapPin, Phone, Mail } from "lucide-react";
import { BrandMark } from "@/components/common/BrandMark";
import { contact, about } from "@/data/siteContent";

export function Footer() {
  return (
    <footer className="bg-cocoa-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-100/70">
            {about.body}
          </p>
          <div className="mt-6 flex gap-3">
            {contact.social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 text-xs font-medium transition-colors hover:bg-caramel-500"
                aria-label={item.label}
              >
                {item.label[0]}
              </a>
            ))}
          </div>
        </div>

        <div className="md:justify-self-end">
          <h3 className="font-display text-xl">Contacts</h3>
          <ul className="mt-5 space-y-3 text-sm text-cream-100/80">
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-caramel-400" />
              {contact.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-caramel-400" />
              {contact.phone}
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-caramel-400" />
              {contact.email}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-50/10 px-6 py-5 text-center text-xs text-cream-100/50">
        © {new Date().getFullYear()} Angel's Cakes and Pastries. All rights reserved.
      </div>
    </footer>
  );
}
