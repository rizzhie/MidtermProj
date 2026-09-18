import { MapPin, Phone, Mail } from "lucide-react";
import { BrandMark } from "@/components/common/brand-mark";
import { about, contact } from "@/data/siteContent";

export function ContactSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <BrandMark dark />
          <p className="mt-6 max-w-md text-cocoa-900/75 leading-relaxed">
            {about.bodies[0]}
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-cocoa-900">Contacts</h2>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cocoa-900 text-cream-50">
                <MapPin className="h-4.5 w-4.5" />
              </span>
              <span className="text-cocoa-900/85">{contact.address}</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cocoa-900 text-cream-50">
                <Phone className="h-4.5 w-4.5" />
              </span>
              <span className="text-cocoa-900/85">{contact.phone}</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cocoa-900 text-cream-50">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <span className="text-cocoa-900/85">{contact.email}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}