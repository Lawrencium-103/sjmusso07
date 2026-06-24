"use client";

import { useState, useEffect } from "react";

interface Position {
  id: number;
  title: string;
  description: string;
}

interface Aspirant {
  id: number;
  name: string;
  position_id: number;
  cleared: number;
  position_title: string;
}

type Step = "login" | "ballot" | "celebrate";

export default function VotePage() {
  const [step, setStep] = useState<Step>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [positions, setPositions] = useState<Position[]>([]);
  const [aspirants, setAspirants] = useState<Aspirant[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<Record<number, number>>({});
  const [confirmedPositions, setConfirmedPositions] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [voterName, setVoterName] = useState("");

  const validPositions = positions.filter((pos) =>
    aspirants.some((a) => a.position_id === pos.id && a.cleared)
  );

  useEffect(() => {
    if (step === "celebrate") {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/vote-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      setVoterName(name);
      setPositions(data.positions || []);
      setAspirants(data.aspirants || []);

      if (data.hasVoted) {
        setStep("celebrate");
      } else {
        setStep("ballot");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAspirant = (positionId: number, aspirantId: number) => {
    setSelectedVotes((prev) => ({ ...prev, [positionId]: aspirantId }));
  };

  const handleConfirmPosition = (positionId: number) => {
    if (!selectedVotes[positionId]) {
      setError(`Please select a candidate for this position first.`);
      return;
    }
    setError("");
    setConfirmedPositions((prev) => {
      const next = new Set(prev);
      next.add(positionId);
      return next;
    });
  };

  const handleSubmitAll = async () => {
    const allConfirmed = validPositions.every((pos) => confirmedPositions.has(pos.id));
    if (!allConfirmed) {
      setError("Please confirm your vote for each position first.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const votes = Object.entries(selectedVotes).map(
        ([positionId, aspirantId]) => ({
          position_id: parseInt(positionId),
          aspirant_id: aspirantId,
        })
      );
      const res = await fetch("/api/vote-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, votes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Vote submission failed");
        return;
      }
      setStep("celebrate");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("login");
    setName("");
    setEmail("");
    setPassword("");
    setSelectedVotes({});
    setConfirmedPositions(new Set());
    setError("");
    setShowConfetti(false);
  };

  if (step === "login") {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-brand-gold/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
        </div>
        <div className="relative w-full max-w-md">
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-black/20 border border-white/10">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-blue-700 shadow-lg shadow-brand-blue/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-brand-blue tracking-tight">SJMUSSO &apos;07 Election</h1>
              <p className="text-sm text-gray-500 mt-1">Enter your details to cast your vote</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}
              <div>
                <label className="label mb-1.5">Full Name</label>
                <input className="input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="label mb-1.5">Email Address</label>
                <input type="email" className="input" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label mb-1.5">Voting Password</label>
                <input type="password" className="input" placeholder="Enter voting password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Proceed to Vote"
                )}
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-gray-400">
              Election: June 27 - 28, 2026 &middot; One vote per email
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === "celebrate") {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] overflow-hidden pt-16">
        {showConfetti && (
          <>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ["#e7b801", "#054ea4", "#d52419", "#22c55e", "#a855f7", "#ec4899"][i % 6],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 2}s infinite alternate`,
                  opacity: 0.8,
                  width: `${4 + Math.random() * 8}px`,
                  height: `${4 + Math.random() * 8}px`,
                }}
              />
            ))}
          </>
        )}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" style={{ animation: "float 8s ease-in-out infinite alternate" }} />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" style={{ animation: "float 10s ease-in-out infinite alternate-reverse" }} />
        </div>
        <div className="relative w-full max-w-lg px-4 text-center">
          <div
            className="rounded-2xl bg-white/95 backdrop-blur-sm p-10 shadow-2xl shadow-black/20 border border-white/10"
            style={{ animation: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-blue mb-3">Thank You, {voterName}!</h1>
            <p className="text-lg text-gray-500 mb-2">Your vote has been cast successfully.</p>
            <p className="text-sm text-gray-400 mb-8 max-w-sm mx-auto">
              You have helped shape the future of the SJMUSSO &apos;07 Alumni Association. Results will be announced after the election closes.
            </p>
            <div className="flex flex-col items-center gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-8 py-3 text-base font-medium text-white shadow-lg shadow-brand-blue/20 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Back to Home
              </a>
              <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                Vote again with a different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-gray via-white to-brand-gray">
      <div className="sticky z-20 bg-brand-blue shadow-md" style={{ top: "56px" }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          <span className="text-xs font-medium text-white/80">
            Voting as <strong className="text-white">{voterName}</strong>
          </span>
          <button onClick={handleReset} className="text-xs font-medium text-white/70 hover:text-white transition-colors">Exit</button>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="text-center mb-10">
          <span className="inline-block rounded-full bg-brand-blue/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-blue mb-3 border border-brand-blue/20">
            Executive Council Election 2026
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-blue tracking-tight">Cast Your Vote</h1>
          <p className="mt-2 text-sm text-gray-500">
            Select your preferred candidate for each position, then confirm your choices.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-600 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <div className="space-y-8">
          {validPositions.map((pos, idx) => {
            const candidates = aspirants.filter(
              (a) => a.position_id === pos.id && a.cleared
            );
            const isConfirmed = confirmedPositions.has(pos.id);
            const isSelected = !!selectedVotes[pos.id];
            return (
              <div
                key={pos.id}
                className={`rounded-2xl border-2 p-6 sm:p-8 transition-all duration-500 ${
                  isConfirmed
                    ? "border-green-300 bg-green-50/50 shadow-lg shadow-green-100"
                    : isSelected
                    ? "border-brand-blue bg-white shadow-xl shadow-brand-blue/5"
                    : "border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-gray-200"
                }`}
                style={{ animation: `fadeUp 0.5s ease-out ${idx * 0.1}s forwards`, opacity: 0 }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue/10 text-xs font-bold text-brand-blue">
                        {idx + 1}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{pos.title}</h2>
                    </div>
                    {pos.description && (
                      <p className="text-sm text-gray-500 mt-1 ml-9">{pos.description}</p>
                    )}
                  </div>
                  {isConfirmed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Voted
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  {candidates.map((c) => {
                    const isSelectedCand = selectedVotes[pos.id] === c.id;
                    return (
                      <label
                        key={c.id}
                        className={`group relative flex cursor-pointer items-center gap-3 sm:gap-4 rounded-xl border-2 p-3 sm:p-4 transition-all duration-300 ${
                          isConfirmed
                            ? isSelectedCand
                              ? "border-green-400 bg-green-50"
                              : "border-gray-100 bg-gray-50 opacity-60"
                            : isSelectedCand
                            ? "border-brand-blue bg-blue-50 shadow-md"
                            : "border-gray-300 bg-white hover:border-brand-blue/50 hover:bg-blue-50/30 hover:shadow-sm"
                        }`}
                      >
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold transition-all duration-300 ${
                          isSelectedCand
                            ? "bg-brand-blue text-white shadow-md"
                          : "bg-gray-200 text-gray-700 group-hover:bg-gray-300"
                        }`}>
                          {isSelectedCand ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            c.name.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base font-semibold truncate ${
                            isSelectedCand ? "text-brand-blue" : "text-gray-800"
                          }`}>{c.name}</p>
                        </div>
                        {!isConfirmed && (
                          <>
                            <input
                              type="radio"
                              name={`pos_${pos.id}`}
                              value={c.id}
                              checked={isSelectedCand}
                              onChange={() => handleSelectAspirant(pos.id, c.id)}
                              className="sr-only"
                            />
                            <div className={`flex h-7 w-7 min-h-7 min-w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                              isSelectedCand
                                ? "border-brand-blue bg-brand-blue"
                                : "border-gray-300 bg-white group-hover:border-brand-blue/60"
                            }`}>
                              {isSelectedCand && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                          </>
                        )}
                        {isConfirmed && isSelectedCand && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Voted
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {!isConfirmed && (
                  <button
                    onClick={() => handleConfirmPosition(pos.id)}
                    disabled={!isSelected}
                    className={`mt-5 w-full rounded-xl py-3 text-sm font-medium transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-brand-blue to-blue-700 text-white shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:shadow-brand-blue/30 hover:-translate-y-0.5"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Confirm Vote for {pos.title}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {confirmedPositions.size} of {validPositions.length} positions confirmed
            </span>
          </div>
          <div className="h-2 w-full max-w-md mx-auto rounded-full bg-gray-100 overflow-hidden mb-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-blue to-green-500 transition-all duration-700"
              style={{ width: `${(confirmedPositions.size / Math.max(validPositions.length, 1)) * 100}%` }}
            />
          </div>
          <button
            onClick={handleSubmitAll}
            disabled={loading || confirmedPositions.size !== validPositions.length}
            className={`inline-flex items-center gap-3 rounded-xl px-10 py-4 text-lg font-bold transition-all duration-300 ${
              confirmedPositions.size === validPositions.length && validPositions.length > 0
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-1"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit All Votes
              </>
            )}
          </button>
          <p className="mt-4 text-xs text-gray-400">
            {confirmedPositions.size === validPositions.length
              ? "All positions confirmed. Click Submit to cast your vote."
              : `Confirm your vote for each position above before submitting.`}
          </p>
        </div>

        <div className="mt-16 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            &larr; Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}
