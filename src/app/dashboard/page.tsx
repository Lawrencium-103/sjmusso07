"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ChangePasswordModal from "@/components/ChangePasswordModal";

interface AlumniUser {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  role: string;
  gender: string;
  location: string;
}

interface Attendance {
  id: number;
  meeting_id: number;
  attended: number;
  title: string;
  meeting_date: string;
}

interface Payment {
  id: number;
  year: number;
  month: number;
  paid: number;
  confirmed: number;
}

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
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AlumniUser | null>(null);
  const [tab, setTab] = useState<string>("overview");
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (data) => {
        if (cancelled) return;
        if (!data.user) {
          router.replace("/login");
          return;
        }
        setUser(data.user);
        if (data.user.must_change_password) {
          setShowPasswordModal(true);
        }
        const [att, pay, nws, meet] = await Promise.all([
          fetch("/api/attendance").then((r) => r.json()),
          fetch("/api/payments").then((r) => r.json()),
          fetch("/api/news").then((r) => r.json()),
          fetch("/api/meetings").then((r) => r.json()),
        ]);
        if (cancelled) return;
        setAttendance(att.attendance || []);
        setPayments(pay.payments || []);
        setMeetings(meet.meetings || []);
        setNews(nws.news || []);
        setLoading(false);
        setTimeout(() => setMounted(true), 50);
      })
      .catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-[3px] border-brand-blue/10" />
            <div className="absolute inset-0 rounded-full border-[3px] border-t-brand-blue animate-spin" />
          </div>
          <span className="text-sm text-gray-400 font-medium tracking-wide">Loading dashboard</span>
        </div>
      </div>
    );
  }

  const tabClasses = (name: string) =>
    `relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
      tab === name
        ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
    }`;

  const currentYear = new Date().getFullYear();
  const yearPayments = payments.filter((p) => p.year === currentYear);
  const paidCount = yearPayments.filter((p) => p.paid).length;
  const payProgress = yearPayments.length > 0 ? Math.round((paidCount / yearPayments.length) * 100) : 0;

  const upcomingMeetings = meetings
    .filter((m) => new Date(m.meeting_date) > new Date())
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/">
              <img
                src="/logo.jpeg"
                alt="Logo"
                className="h-10 w-10 rounded-full border-2 border-brand-blue/10 object-cover transition-transform hover:scale-105"
              />
            </a>
            <div>
              <h1 className="text-lg font-bold text-brand-blue tracking-tight">
                SJMUSSO &apos;07
              </h1>
              <p className="text-xs text-gray-400">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-blue/8 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-blue/80 border border-brand-blue/15">
              {user?.role.replace("_", " ")}
            </span>
            <button onClick={handleLogout} className="btn-ghost text-xs">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="border-b border-gray-200/60 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl gap-1.5 overflow-x-auto px-4 py-2.5 scrollbar-hide">
          <button onClick={() => setTab("overview")} className={tabClasses("overview")}>Overview</button>
          <button onClick={() => setTab("attendance")} className={tabClasses("attendance")}>Attendance</button>
          <button onClick={() => setTab("contributions")} className={tabClasses("contributions")}>Contributions</button>
          <a href="/vote" className="relative inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-brand-gold to-yellow-600 text-white shadow-md shadow-brand-gold/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-lg hover:shadow-brand-gold/30 hover:-translate-y-0.5 active:scale-[0.97]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Vote Now
          </a>
          <button onClick={() => setTab("news")} className={tabClasses("news")}>News</button>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        {tab === "overview" && (
          <div className="space-y-8">
            <div className={`${mounted ? "animate-enter" : "opacity-0"}`}>
              <h2 className="text-2xl font-bold text-brand-blue tracking-tight">Dashboard</h2>
              <p className="text-sm text-gray-400 mt-1">Welcome back, {user?.name}!</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className={`card-premium ${mounted ? "animate-enter animate-enter-delay-1" : "opacity-0"}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-md shadow-green-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Attendance</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {attendance.filter((a) => a.attended).length}
                    <span className="text-base font-normal text-gray-400 ml-1.5">/ {attendance.length}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">meetings attended</p>
                </div>
              </div>

              <div className={`card-premium ${mounted ? "animate-enter animate-enter-delay-2" : "opacity-0"}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-blue-700 text-white shadow-md shadow-blue-200">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">{currentYear}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {paidCount}
                    <span className="text-base font-normal text-gray-400 ml-1.5">/ {yearPayments.length} mo</span>
                  </p>
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          payProgress >= 80 ? "bg-gradient-to-r from-green-400 to-emerald-500" : payProgress >= 50 ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gradient-to-r from-red-400 to-rose-500"
                        }`}
                        style={{ width: `${payProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{payProgress}% paid</p>
                  </div>
                </div>
              </div>

              <a href="/vote" className={`group block ${mounted ? "animate-enter animate-enter-delay-3" : "opacity-0"}`}>
                <div className="card-premium">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-md shadow-amber-200 group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-amber-500 group-hover:text-amber-600 transition-colors">Action</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-blue transition-colors mb-1">Vote Now</h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Cast your vote for the executive council &rarr;</p>
                  </div>
                </div>
              </a>
            </div>

            {upcomingMeetings.length > 0 && (
              <div className={`card-premium ${mounted ? "animate-enter animate-enter-delay-4" : "opacity-0"}`}>
                <div>
                  <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-brand-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    Upcoming Events
                  </h3>
                  <div className="space-y-2">
                    {upcomingMeetings.map((m) => (
                      <div key={m.id} className="flex items-center gap-4 rounded-xl border border-gray-100/80 bg-gray-50/50 p-3.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-gray-200 hover:bg-white hover:shadow-sm">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 text-white text-xs font-bold shadow-sm">
                          <span className="text-sm leading-none">{new Date(m.meeting_date).getDate()}</span>
                          <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-80">
                            {new Date(m.meeting_date).toLocaleDateString("en", { month: "short" })}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{m.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(m.meeting_date).toLocaleDateString("en-US", {
                              weekday: "long", year: "numeric", month: "long", day: "numeric",
                            })}
                          </p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <a
              href="/vote"
              className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue via-blue-700 to-blue-800 p-8 text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-2xl hover:shadow-brand-blue/30 hover:-translate-y-1 active:scale-[0.99] ${mounted ? "animate-enter animate-enter-delay-5" : "opacity-0"}`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-brand-gold">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Vote Now — Election 2026
                </h3>
                <p className="text-sm text-white/60 max-w-md leading-relaxed">
                  Cast your vote for the alumni executive council. Every vote counts!
                </p>
                <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-brand-gold group-hover:gap-3 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  Cast Your Vote
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </a>
          </div>
        )}

        {tab === "attendance" && (
          <div className={`${mounted ? "animate-enter" : "opacity-0"}`}>
            <h2 className="text-xl font-bold text-brand-blue mb-5 tracking-tight">Meeting Attendance</h2>
            {attendance.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">No attendance records yet.</p>
              </div>
            ) : (
              <div className="card-premium overflow-hidden">
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Meeting</th>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Date</th>
                          <th className="px-5 py-3.5 font-semibold text-gray-600 text-[11px] uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((a, i) => (
                          <tr key={a.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50" style={{ animation: `fadeUp 0.4s cubic-bezier(0.32,0.72,0,1) ${i * 0.05}s forwards`, opacity: 0 }}>
                            <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{a.title}</td>
                            <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(a.meeting_date).toLocaleDateString()}</td>
                            <td className="px-5 py-3.5">
                              {a.attended ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                  Present
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Absent
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "contributions" && (
          <div className={`space-y-6 ${mounted ? "animate-enter" : "opacity-0"}`}>
            <div className="card-premium">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-brand-blue tracking-tight">Monthly Contributions</h2>
                  <span className="text-xs text-gray-400 font-medium">{currentYear}</span>
                </div>

                <div className="mb-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Year Progress</h3>
                    <span className={`text-sm font-bold ${payProgress >= 80 ? "text-emerald-600" : payProgress >= 50 ? "text-amber-600" : "text-red-500"}`}>{payProgress}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        payProgress >= 80 ? "bg-gradient-to-r from-emerald-400 to-green-500" : payProgress >= 50 ? "bg-gradient-to-r from-amber-400 to-yellow-500" : "bg-gradient-to-r from-red-400 to-rose-500"
                      }`}
                      style={{ width: `${payProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{paidCount} of {yearPayments.length} months paid</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Confirmed</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Unconfirmed</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gray-200" /> Unpaid</span>
                  </div>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {yearPayments
                    .sort((a, b) => b.month - a.month)
                    .map((p) => (
                      <div
                        key={p.id}
                        className={`rounded-xl border p-4 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          p.paid && p.confirmed
                            ? "border-emerald-200 bg-emerald-50/50"
                            : p.paid
                            ? "border-amber-200 bg-amber-50/50"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-800">{months[p.month - 1]}</span>
                          {p.paid && p.confirmed ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Confirmed
                            </span>
                          ) : p.paid ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                              Unpaid
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "elections" && (
          <div className={`flex flex-col items-center justify-center py-20 text-center ${mounted ? "animate-enter" : "opacity-0"}`}>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-xl shadow-amber-200/30">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-blue mb-2">Election 2026</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-md leading-relaxed">
              Voting is done through the dedicated election portal. Click below to cast your vote.
            </p>
            <a
              href="/vote"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-yellow-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-gold/25 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-xl hover:shadow-brand-gold/30 hover:-translate-y-1 active:scale-[0.97]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Go to Voting Portal
            </a>
          </div>
        )}

        {tab === "news" && (
          <div className={`space-y-4 ${mounted ? "animate-enter" : "opacity-0"}`}>
            <h2 className="text-xl font-bold text-brand-blue tracking-tight">News & Updates</h2>
            {news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">No news updates yet.</p>
              </div>
            ) : (
              news.map((item, i) => (
                <div key={item.id} className="card-premium" style={{ animation: `fadeUp 0.5s cubic-bezier(0.32,0.72,0,1) ${i * 0.1}s forwards`, opacity: 0 }}>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                        <p className="mt-1 text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()} by {item.created_by_name}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-brand-blue/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-blue">News</span>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap text-sm text-gray-600 leading-relaxed">{item.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <ChangePasswordModal
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
