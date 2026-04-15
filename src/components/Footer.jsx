// Footer.jsx
import React from "react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Our Services", href: "/#services" },
  { label: "Our Clients", href: "/#clients" },
  { label: "Contact us", href: "/#contact" },
];

export default function Footer({services = [], cities = []}) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3">
            <img src="/assets/Markcare Logo2.png" alt="Mark Care Logo" className="w-24 rounded-md h-auto" />
            <div className="leading-tight">
              <div className="font-bold text-slate-900 text-[18px]">Mark Care Pvt. Ltd.</div>
              <div className="text-xs text-slate-500 text-[14px] mt-2">Services at Home • Industrial Solutions</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600">High-quality, standardized & reliable services at your door and for your facilities.</p>
        </div>
        <div>
          <div className="font-semibold">Services</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {services.slice(0, 6).map((s) => (
              <li key={s.title}><a href="#services" className="hover:underline">{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold">Reach Us</div>
          <div className="mt-3 text-sm text-slate-600">Pan‑India presence:</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {cities.map((c) => (
              <span key={c} className="px-2 py-1 rounded-full bg-red-100 text-slate-700 text-xs">{c}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <div className="mt-3 text-sm text-slate-700 space-y-1">
            <a href="tel:+919884927676" className="block hover:underline">+91 98849 27676</a>
            <a href="tel:+917010421860" className="block hover:underline">+91 70104 21860</a>
            <a href="https://www.markcare.net" target="_blank" rel="noreferrer" className="block hover:underline">www.markcare.net</a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 py-6 border-t">© {new Date().getFullYear()} Mark Care Pvt. Ltd. All rights reserved.</div>
    </footer>
  );
}
