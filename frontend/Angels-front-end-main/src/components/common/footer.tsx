import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { BrandMark } from "@/components/common/brand-mark";
import { contact, about } from "@/data/siteContent";

const socialIcons: Record<string, IconType> = {
  Instagram: FaInstagram,
  Facebook: FaFacebookF,
  X: FaXTwitter,
};

export function Footer() {
  return (
    <footer className="bg-cocoa-900 text-cream-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-2">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-100/70">
            {about.bodies[0]}
          </p>
          <div className="mt-6 flex gap-3">
            {contact.social.map((item) => {
              const Icon = socialIcons[item.label];
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/10 transition-colors hover:bg-caramel-500"
                  aria-label={item.label}
                >
                  {Icon ? (
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    item.label[0]
                  )}
                </a>
              );
            })}
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
        <Link
          to="/admin/login"
          aria-label="Admin sign in"
          className="ml-2 inline-block text-cream-100/20 no-underline transition-colors hover:text-cream-100/60"
        >
          ·
        </Link>
      </div>
    </footer>
  );
}