"use client";

import { useEffect, useState } from "react";

interface Alumni {
  id: number;
  name: string;
}

export default function AlumniSpotlight() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) setAlumni(data.users);
      })
      .catch(() => {});
  }, []);

  if (alumni.length === 0) return null;

  const items = [...alumni, ...alumni, ...alumni];

  return (
    <section className="relative bg-gradient-to-b from-white to-brand-gray/50 py-16 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 mb-10 sm:mb-12">
        <div className="text-center">
          <span className="inline-block rounded-full bg-brand-blue/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-blue mb-3">
            Our Community
          </span>
          <h2 className="text-3xl font-bold text-brand-blue sm:text-4xl tracking-tight">
            Meet Our Alumni
          </h2>
          <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto">
            Reconnect with classmates from the graduating class of 2007
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-brand-gray/50 via-brand-gray/50 to-transparent z-10 pointer-events-none" />
        <div
          className="flex gap-4 animate-marquee-slow"
          style={{ width: "max-content" }}
        >
          {items.map((a, i) => (
            <div
              key={`${a.id}-${i}`}
              className="flex-shrink-0 flex items-center gap-3 rounded-2xl bg-white border border-gray-100 px-5 py-3 shadow-sm hover:shadow-lg hover:shadow-brand-blue/5 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-blue-700 text-xs font-bold text-white shadow-sm">
                {a.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <p className="text-sm font-medium text-gray-700 whitespace-nowrap group-hover:text-brand-blue transition-colors">
                {a.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <a
          href="/register"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:text-blue-700 transition-all duration-200 group"
        >
          Join your classmates
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
