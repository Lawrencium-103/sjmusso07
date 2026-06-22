"use client";

import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ElectionCountdown() {
  const electionStart = new Date("2026-06-27T00:00:00").getTime();
  const electionEnd = new Date("2026-06-28T23:59:59").getTime();
  const [now, setNow] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t < electionStart) {
        const diff = electionStart - t;
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [electionStart]);

  const phase =
    now < electionStart
      ? "countdown"
      : now <= electionEnd
      ? "voting"
      : "results";

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] py-20 sm:py-24">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <span className="inline-block rounded-full bg-brand-gold/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-gold mb-5 border border-brand-gold/20">
          Election 2026
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
          {phase === "countdown" && "Election Starts In"}
          {phase === "voting" && "Voting Is Now Open"}
          {phase === "results" && "You Have Decided Your Executives"}
        </h2>
        <p className="text-white/50 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
          {phase === "countdown" &&
            "June 27 - 28, 2026. Cast your vote for the alumni executive council."}
          {phase === "voting" &&
            "Voting ends June 28 at 11:59 PM. Make your voice heard!"}
          {phase === "results" &&
            "Thank you to everyone who participated. Your executives have been elected."}
        </p>

        {phase === "countdown" && (
          <div className="flex items-center justify-center gap-3 sm:gap-5 mb-10">
            {[
              { label: "Days", value: pad(timeLeft.days) },
              { label: "Hours", value: pad(timeLeft.hours) },
              { label: "Minutes", value: pad(timeLeft.minutes) },
              { label: "Seconds", value: pad(timeLeft.seconds) },
            ].map((unit) => (
              <div key={unit.label} className="text-center">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-inner">
                  <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                    {unit.value}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-white/40 uppercase tracking-[0.15em] font-medium">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {(phase === "voting" || phase === "results") && (
          <a
            href={phase === "voting" ? "/vote" : "/"}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:bg-yellow-600 hover:shadow-xl hover:shadow-brand-gold/30 hover:-translate-y-0.5"
          >
            {phase === "voting" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Vote Now
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                See Results
              </>
            )}
          </a>
        )}

        {phase !== "voting" && (
          <p className="mt-5 text-xs text-white/30">
            Election: June 27 - 28, 2026
          </p>
        )}
      </div>
    </section>
  );
}
