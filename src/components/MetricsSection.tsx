"use client";

import { useEffect, useRef, useState } from "react";

interface Metric {
  value: number;
  label: string;
  suffix?: string;
  icon: string;
}

export default function MetricsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [started, setStarted] = useState(false);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    fetch("/api/metrics")
      .then((r) => r.json())
      .then((data) => {
        setMetrics([
          { value: data.total_alumni, label: "Alumni Members", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
          { value: data.total_positions, label: "Executive Positions", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
          { value: Math.max(data.total_meetings, 1), label: "Annual Reunions", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
          { value: data.years_since_graduation || 19, label: "Years of Excellence", icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" },
        ]);
      })
      .catch(() => {
        setMetrics([
          { value: 42, label: "Alumni Members", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
          { value: 7, label: "Executive Positions", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" },
          { value: 1, label: "Annual Reunions", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
          { value: 19, label: "Years of Excellence", icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" },
        ]);
      });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || metrics.length === 0) return;
    const durations = [2000, 1500, 1000, 2500];
    const startTimes = metrics.map(() => Date.now());

    const animate = () => {
      const now = Date.now();
      const newCounts = metrics.map((m, i) => {
        const elapsed = now - startTimes[i];
        const progress = Math.min(elapsed / durations[i], 1);
        return Math.floor(progress * m.value);
      });
      setCounts(newCounts);
      if (newCounts.some((c, i) => c < metrics[i].value)) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [started, metrics]);

  return (
    <section className="relative bg-white py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#e8e9eb,transparent_70%)]" />
      <div ref={ref} className="relative mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <span className="section-tag mb-5 inline-block">By the Numbers</span>
          <h2 className="section-title">Our Impact</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`group relative rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 text-center shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-500 hover:-translate-y-2 ${
                started ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
              style={{
                transitionDelay: `${i * 100}ms`,
                transitionProperty: "opacity, transform",
                transitionDuration: "600ms",
              }}
            >
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-blue/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                  </svg>
                </div>
              </div>
              <div className="text-5xl sm:text-6xl font-bold tabular-nums leading-none mb-2"
                style={{
                  background: "linear-gradient(135deg, #054ea4, #e7b801)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {counts[i]}
                {m.suffix || "+"}
              </div>
              <p className="mt-3 text-lg sm:text-xl text-gray-500 font-medium">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
