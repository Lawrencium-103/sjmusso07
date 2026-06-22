"use client";

import { useEffect, useState } from "react";

interface Alumni {
  id: number;
  name: string;
}

export default function AlumniTicker() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (data.users) {
          const shuffled = [...data.users].sort(() => Math.random() - 0.5);
          setAlumni(shuffled);
        }
      })
      .catch(() => {});
  }, []);

  if (alumni.length === 0) return null;

  const items = [...alumni, ...alumni, ...alumni];

  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none" />
        <div className="flex gap-1 animate-marquee-slow py-3" style={{ width: "max-content" }}>
          {items.map((a, i) => (
            <span
              key={`${a.id}-${i}`}
              className="inline-flex items-center gap-2 px-4 text-sm text-white/50 whitespace-nowrap"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white/70 shrink-0">
                {a.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              {a.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
