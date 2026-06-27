"use client";

import { useEffect, useState, useRef } from "react";
import ElectionCountdown from "@/components/ElectionCountdown";
import MetricsSection from "@/components/MetricsSection";
import AlumniSpotlight from "@/components/AlumniSpotlight";
import AlumniTicker from "@/components/AlumniTicker";
import Testimonials from "@/components/Testimonials";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
  created_by_name: string;
}

interface Meeting {
  id: number;
  title: string;
  description: string;
  meeting_date: string;
  created_at: string;
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
}

function StaggerReveal({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            animation: `staggerIn 0.5s ease-out ${i * 0.035}s forwards`,
            opacity: 0,
            transform: "translateY(12px)",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

function AnimatedParagraph({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className="inline">
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.3em]"
          style={{
            animation: `slideUpWord 0.4s ease-out ${delay + i * 0.04}s forwards`,
            opacity: 0,
            transform: "translateY(8px)",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

function TypewriterText({ text, className = "" }: { text: string; className?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 600);
    return () => clearTimeout(timer);
  }, []);
  return (
    <span className={className}>
      {show ? (
        <span className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-brand-gold"
          style={{
            animation: "typing 2s steps(30) 1s forwards, blink 0.8s step-end infinite",
            maxWidth: "fit-content",
          }}
        >
          {text}
        </span>
      ) : (
        <span className="opacity-0">{text}</span>
      )}
    </span>
  );
}

export default function Home() {
  const [splash, setSplash] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [resultsPublished, setResultsPublished] = useState(false);
  const [voteResults, setVoteResults] = useState<any[]>([]);
  const [turnout, setTurnout] = useState({ voted: 0, total: 0, percentage: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/news").then((r) => r.json()),
      fetch("/api/meetings").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()).catch(() => ({ settings: {} })),
      fetch("/api/votes?scope=public").then((r) => r.json()).catch(() => ({ results: [], turnout: { voted: 0, total: 0, percentage: 0 } })),
    ])
      .then(([newsData, meetingsData, settingsData, votesData]) => {
        setNews(newsData.news || []);
        setMeetings(meetingsData.meetings || []);
        setResultsPublished(settingsData.settings?.results_published === "true");
        setVoteResults(votesData.results || []);
        setTurnout(votesData.turnout || { voted: 0, total: 0, percentage: 0 });
      })
      .catch(() => {});
  }, []);

  const mergedFeed = [
    ...news.map((n) => ({ ...n, type: "news" as const, sortDate: new Date(n.created_at).getTime() })),
    ...meetings.map((m) => ({ ...m, type: "meeting" as const, sortDate: new Date(m.meeting_date).getTime(), id: m.id + 1000 })),
  ].sort((a, b) => b.sortDate - a.sortDate);

  return (
    <>
      {/* ─── SPLASH SCREEN ─── */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] transition-all duration-700 ${
          splash ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "3s" }} />
          <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/30 rounded-full blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center">
          <div className="mb-6" style={{ animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
            <div className="relative">
              <img src="/logo.jpeg" alt="SJMUSSO" className="h-28 w-28 sm:h-32 sm:w-32 rounded-3xl border-2 border-white/15 object-cover shadow-2xl shadow-black/30" />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-brand-gold/20 to-transparent opacity-0 animate-pulse" style={{ animationDelay: "0.5s", animationDuration: "2s" }} />
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
            SJMUSSO <span className="text-brand-gold">&apos;07</span>
          </h1>
          <div className="mt-3 overflow-hidden">
            <p className="text-sm sm:text-base text-white/40 tracking-[0.25em] uppercase" style={{ animation: "typing 1.5s steps(25) 0.3s forwards, blink 0.8s step-end infinite", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "fit-content", borderRight: "2px solid rgba(231,184,1,0.5)" }}>
              To Know, To Love, To Serve
            </p>
          </div>
          <div className="mt-10 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-brand-gold/80"
                style={{ animation: `splashDot 1s ease-in-out ${i * 0.25}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/frontage.jpeg)",
            animation: "slowZoom 20s ease-in-out infinite alternate",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/75" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        <div
          className="absolute top-20 right-20 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"
          style={{ animation: "float 8s ease-in-out infinite alternate" }}
        />
        <div
          className="absolute bottom-32 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"
          style={{ animation: "float 10s ease-in-out infinite alternate-reverse" }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl"
          style={{ animation: "float 12s ease-in-out infinite alternate" }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl">
            <div
              className="flex items-center gap-5 mb-6"
              style={{
                animation: "fadeUp 0.6s ease-out 0.1s forwards",
                opacity: 0,
              }}
            >
              <div>
                <span className="inline-block rounded-full bg-brand-gold/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold border border-brand-gold/20 backdrop-blur-sm">
                  Saint John/Mary&apos;s Unity Secondary School
                </span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white mt-2 tracking-tight">
                  SJMUSSO &apos;07
                </h1>
              </div>
            </div>

            <TypewriterText
              text="To Know, To Love, To Serve"
              className="text-2xl sm:text-3xl font-medium text-brand-gold mb-3 block"
            />

            <p
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
              style={{
                animation: "fadeUp 0.6s ease-out 0.3s forwards",
                opacity: 0,
              }}
            >
              <StaggerReveal text="Welcome Home, Class of 2007" />
            </p>

            <p
              className="text-lg sm:text-xl text-white/60 mb-10 max-w-xl leading-relaxed"
              style={{
                animation: "fadeUp 0.6s ease-out 0.45s forwards",
                opacity: 0,
              }}
            >
              Reconnect with old classmates, stay updated on events, participate
              in elections, and contribute to the growth of our alma mater.
            </p>
            <div
              className="flex flex-wrap items-center gap-4"
              style={{
                animation: "fadeUp 0.6s ease-out 0.55s forwards",
                opacity: 0,
              }}
            >
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5"
                style={{ animation: "glowPulse 3s ease-in-out infinite" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign In
              </a>
              <a
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-brand-gold/20 transition-all duration-300 hover:bg-yellow-600 hover:shadow-xl hover:shadow-brand-gold/30 hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
                Register Now
              </a>
              <a
                href="#purpose"
                className="text-sm text-white/50 hover:text-white transition-all duration-200 underline underline-offset-4 decoration-white/20 hover:decoration-white/60 ml-1"
              >
                Learn More &darr;
              </a>
            </div>
          </div>
        </div>

        <AlumniTicker />
      </section>

      {/* ─── PURPOSE ─── */}
      <section id="purpose" className="bg-white py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4">
          <FadeInSection>
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <span className="section-tag mb-5 inline-block">Our Purpose</span>
                <h2 className="section-title mb-6 text-left">
                  Why This Platform?
                </h2>
                <div className="space-y-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
                  <p>
                    <AnimatedParagraph
                      text="The SJMUSSO '07 Alumni Platform was created to bridge the gap between former classmates and strengthen the bond that was forged within the walls of Saint John/Mary's Unity Secondary School, Owo."
                      delay={0.2}
                    />
                  </p>
                  <p>
                    <AnimatedParagraph
                      text="We believe that the relationships built during our formative years should not fade with time. This platform serves as a central hub where alumni can connect, share updates, participate in the governance of the association, and collectively contribute to the development of our alma mater."
                      delay={0.6}
                    />
                  </p>
                  <p>
                    <AnimatedParagraph
                      text="From electing executive council members to tracking attendance at reunions and managing monthly contributions — everything is designed to foster transparency, accountability, and active participation."
                      delay={1.0}
                    />
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {[
                  {
                    title: "Reconnect",
                    desc: "Find and connect with old classmates across Nigeria and beyond",
                    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
                  },
                  {
                    title: "Vote",
                    desc: "Participate in association elections and shape the executive council",
                    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                  {
                    title: "Track",
                    desc: "Monitor attendance at reunions and manage your contributions seamlessly",
                    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
                  },
                  {
                    title: "Stay Updated",
                    desc: "Get the latest news, announcements, and reunion updates in real time",
                    icon: "M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0",
                  },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-gray-100 bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-500 hover:-translate-y-2 hover:border-brand-blue/20"
                    style={{
                      animation: `fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1 + 0.2}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue mb-4 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-blue/20">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-brand-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base sm:text-lg text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ─── METRICS ─── */}
      <FadeInSection>
        <MetricsSection />
      </FadeInSection>

      {/* ─── ELECTION COUNTDOWN ─── */}
      <FadeInSection>
        <ElectionCountdown />
      </FadeInSection>

      {/* ─── PUBLISHED RESULTS ─── */}
      {resultsPublished && (
        <section className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-4">
            <FadeInSection>
              <div className="text-center mb-14">
                <span className="section-tag mb-5 inline-block">Results</span>
                <h2 className="section-title">Election Results 2026</h2>
                <p className="section-subtitle mt-4">
                  See the outcome of the alumni executive council elections
                </p>
              </div>
            </FadeInSection>
            <div className="mb-10">
              <FadeInSection>
                <div className="card p-6 text-center max-w-md mx-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Voter Turnout</p>
                  <p className="text-4xl font-bold text-brand-blue">{turnout.percentage}%</p>
                  <p className="text-sm text-gray-500 mt-1">{turnout.voted} of {turnout.total} alumni voted</p>
                  <div className="mt-3 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-blue transition-all" style={{ width: `${turnout.percentage}%` }} />
                  </div>
                </div>
              </FadeInSection>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {voteResults.length > 0 && (() => {
                const positions = [...new Set(voteResults.map((r) => r.position_id))].map((pid) => ({
                  id: pid,
                  title: voteResults.find((r) => r.position_id === pid)?.position_title,
                }));
                return positions.map((pos) => {
                  const posResults = voteResults.filter((r) => r.position_id === pos.id);
                  const maxVotes = Math.max(...posResults.map((r) => r.votes));
                  const totalPosVotes = posResults.reduce((s, r) => s + r.votes, 0);
                  const winner = posResults.find((r) => r.votes === maxVotes);
                  return (
                    <FadeInSection key={pos.id}>
                      <div className="card p-5 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-brand-blue">{pos.title}</h3>
                          <span className="text-[10px] text-gray-400 font-medium">{totalPosVotes} votes</span>
                        </div>
                        <div className="space-y-2">
                          {posResults.map((r) => {
                            const pct = totalPosVotes > 0 ? Math.round((r.votes / totalPosVotes) * 100) : 0;
                            const isWinner = r.votes === maxVotes && maxVotes > 0;
                            return (
                              <div key={r.aspirant_id} className={`flex items-center justify-between gap-2 rounded-lg p-2 ${isWinner ? "bg-amber-50/50 border border-amber-100" : ""}`}>
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  {isWinner && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0 text-amber-500">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                                    </svg>
                                  )}
                                  <span className={`text-sm truncate ${isWinner ? "font-bold text-gray-900" : "text-gray-600"}`}>{r.aspirant_name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                    <div className={`h-full rounded-full ${isWinner ? "bg-brand-gold" : "bg-brand-blue/40"}`} style={{ width: maxVotes > 0 ? `${(r.votes / maxVotes) * 100}%` : 0 }} />
                                  </div>
                                  <span className="text-xs font-bold text-gray-700 w-5 text-right">{r.votes}</span>
                                  <span className="text-[10px] text-gray-400 w-7 text-right">{pct}%</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </FadeInSection>
                  );
                });
              })()}
            </div>
          </div>
        </section>
      )}

      {/* ─── LATEST UPDATES ─── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4">
          <FadeInSection>
            <div className="text-center mb-14">
              <span className="section-tag mb-5 inline-block">Updates</span>
              <h2 className="section-title">Latest Updates</h2>
              <p className="section-subtitle mt-4">
                News, announcements, and upcoming events from the association
              </p>
            </div>
          </FadeInSection>
          {mergedFeed.length === 0 ? (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 text-base">No updates yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mergedFeed.slice(0, 6).map((item, i) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-500 hover:-translate-y-2"
                  style={{
                    animation: `fadeInScale 0.6s ease-out ${i * 0.1}s forwards`,
                    opacity: 0,
                    transform: "scale(0.95)",
                  }}
                >
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    {item.type === "meeting" ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {new Date(item.meeting_date).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                        <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-medium text-brand-blue">Event</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                        </svg>
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-brand-blue transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.type === "meeting" ? (
                    <>
                      <p className="text-base text-gray-600 leading-relaxed line-clamp-2">
                        {item.description || "No description available."}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-400 pt-3 border-t border-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(item.meeting_date).toLocaleDateString("en-US", {
                          weekday: "long", year: "numeric", month: "long", day: "numeric",
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-base text-gray-600 leading-relaxed line-clamp-3">
                        {item.content}
                      </p>
                      {item.created_by_name && (
                        <p className="mt-4 text-sm text-gray-400 flex items-center gap-1.5 pt-3 border-t border-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.created_by_name}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ALUMNI SPOTLIGHT ─── */}
      <FadeInSection>
        <AlumniSpotlight />
      </FadeInSection>

      {/* ─── TESTIMONIALS ─── */}
      <FadeInSection>
        <Testimonials />
      </FadeInSection>
    </>
  );
}
