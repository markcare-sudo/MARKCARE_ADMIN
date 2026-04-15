import React from "react";
import { motion } from "framer-motion";
import { CLIENTS } from "@/utils/data";

const ClientCard = ({ logo, name, subtitle }) => (
    <div className="w-[220px] shrink-0 group rounded-2xl bg-white ring-1 ring-slate-200 p-4 hover:shadow-md transition">
        <div className="aspect-[3/1] grid place-items-center overflow-hidden rounded-xl bg-slate-50">
            <img
                src={logo}
                // alt={name}
                className="h-12 w-auto object-contain group-hover:scale-[1.02] transition"
                loading="lazy"
            />
        </div>
        <div className="mt-3">
            <div className="text-sm font-semibold text-slate-900 line-clamp-1">{name}</div>
            <div className="text-xs text-slate-500 line-clamp-1">{subtitle}</div>
        </div>
    </div>
);

export default function Clients() {
    // duplicate list so translateX:-50% = seamless loop
    const marquee = [...CLIENTS, ...CLIENTS];
    const speed = 20; // seconds per loop (tweak as you like)

    return (
        <section id="clients" className="py-16 lg:py-24 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        Trusted by organizations & communities
                    </div>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Our Clients</h2>
                </div>

                {/* lane 1 */}
                <div className="mt-8 overflow-hidden">
                    <motion.div
                        className="flex gap-4"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
                    >
                        {marquee.map((c, i) => (
                            <ClientCard key={`${c.name}-${i}`} {...c} />
                        ))}
                    </motion.div>
                </div>

                {/* lane 2 (optional, reverse direction for a nice effect) */}
                <div className="mt-6 overflow-hidden">
                    <motion.div
                        className="flex gap-4"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
                    >
                        {marquee
                            .slice()
                            .reverse()
                            .map((c, i) => (
                                <ClientCard key={`${c.name}-rev-${i}`} {...c} />
                            ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
