"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ChangePasswordModal from "@/components/ChangePasswordModal";

interface AlumniUser {
  id: number; name: string; email: string; phone_no: string;
  gender: string; location: string; occupation: string; role: string; created_at: string; profile_picture: string;
}
interface Meeting { id: number; title: string; description: string; meeting_date: string; }
interface Position { id: number; title: string; description: string; }
interface Aspirant { id: number; name: string; position_id: number; cleared: number; position_title: string; }
interface NewsItem { id: number; title: string; content: string; created_at: string; created_by_name: string; }
interface AttendanceRecord { id: number; meeting_id: number; alumni_id: number; attended: number; alumni_name: string; meeting_title: string; }
interface PaymentRecord { id: number; alumni_id: number; year: number; month: number; paid: number; confirmed: number; alumni_name: string; }
interface VoteResult { position_id: number; aspirant_id: number; votes: number; position_title: string; aspirant_name: string; }

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const navItems = [
  { key: "analytics", label: "Analytics", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
  { key: "results", label: "Results", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "users", label: "Users", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { key: "attendance", label: "Attendance", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" },
  { key: "payments", label: "Payments", icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" },
  { key: "positions", label: "Positions", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { key: "aspirants", label: "Aspirants", icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" },
  { key: "news", label: "News", icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" },
];

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<AlumniUser | null>(null);
  const [tab, setTab] = useState("analytics");
  const [users, setUsers] = useState<AlumniUser[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [aspirants, setAspirants] = useState<Aspirant[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [allPayments, setAllPayments] = useState<PaymentRecord[]>([]);
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [turnout, setTurnout] = useState({ voted: 0, total: 0, percentage: 0 });
  const [resultsPublished, setResultsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [newMeeting, setNewMeeting] = useState({ title: "", description: "", meeting_date: "" });
  const [newPosition, setNewPosition] = useState({ title: "", description: "" });
  const [newAspirant, setNewAspirant] = useState({ name: "", position_id: "" });
  const [newNews, setNewNews] = useState({ title: "", content: "" });
  const [editNewsId, setEditNewsId] = useState<number | null>(null);
  const [editNewsTitle, setEditNewsTitle] = useState("");
  const [editNewsContent, setEditNewsContent] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });


  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user || (data.user.role !== "super_admin" && data.user.role !== "admin")) {
          router.replace("/login"); return;
        }
        setUser(data.user);
        if (data.user.must_change_password) setShowPasswordModal(true);
        refreshData();
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  const refreshData = async () => {
    try {
      const [u, m, p, a, n, att, payments, votesRes, s] = await Promise.all([
        fetch("/api/users").then(r => r.json()),
        fetch("/api/meetings").then(r => r.json()),
        fetch("/api/positions").then(r => r.json()),
        fetch("/api/aspirants").then(r => r.json()),
        fetch("/api/news").then(r => r.json()),
        fetch("/api/attendance?all=1").then(r => r.json()).catch(() => ({ attendance: [] })),
        fetch("/api/payments?scope=all").then(r => r.json()).catch(() => ({ payments: [] })),
        fetch("/api/votes?scope=analytics").then(r => r.json()).catch(() => ({ results: [], turnout: { voted: 0, total: 0, percentage: 0 } })),
        fetch("/api/settings").then(r => r.json()).catch(() => ({ settings: {} })),
      ]);
      setUsers(u.users || []);
      setMeetings(m.meetings || []);
      setPositions(p.positions || []);
      setAspirants(a.aspirants || []);
      setNews(n.news || []);
      setAttendance(att.attendance || []);
      setAllPayments(payments.payments || []);
      setVoteResults(votesRes.results || []);
      setTurnout(votesRes.turnout || { voted: 0, total: 0, percentage: 0 });
      setResultsPublished(s.settings?.results_published === "true");

    } catch { setMsg({ type: "error", text: "Failed to load data" }); }
    finally { setLoading(false); }
  };

  const handleRoleChange = async (alumniId: number, role: string) => {
    try { const res = await fetch("/api/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alumni_id: alumniId, role }) }); const data = await res.json(); setMsg({ type: res.ok ? "success" : "error", text: res.ok ? "Role updated" : (data.error || "Failed") }); if (res.ok) refreshData(); } catch { setMsg({ type: "error", text: "Network error" }); }
  };
  const handleAddMeeting = async (e: React.FormEvent) => { e.preventDefault(); try { const res = await fetch("/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newMeeting) }); if (res.ok) { setNewMeeting({ title: "", description: "", meeting_date: "" }); setMsg({ type: "success", text: "Meeting created" }); refreshData(); } } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleAddPosition = async (e: React.FormEvent) => { e.preventDefault(); try { const res = await fetch("/api/positions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newPosition) }); if (res.ok) { setNewPosition({ title: "", description: "" }); setMsg({ type: "success", text: "Position created" }); refreshData(); } } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleAddAspirant = async (e: React.FormEvent) => { e.preventDefault(); try { const res = await fetch("/api/aspirants", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newAspirant.name, position_id: parseInt(newAspirant.position_id) }) }); if (res.ok) { setNewAspirant({ name: "", position_id: "" }); setMsg({ type: "success", text: "Aspirant added" }); refreshData(); } } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleClearAspirant = async (id: number, cleared: number) => { try { await fetch("/api/aspirants", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, cleared: cleared ? 0 : 1 }) }); refreshData(); } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleDeleteAspirant = async (id: number) => { try { await fetch(`/api/aspirants?id=${id}`, { method: "DELETE" }); refreshData(); } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleAddNews = async (e: React.FormEvent) => { e.preventDefault(); try { const res = await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newNews) }); if (res.ok) { setNewNews({ title: "", content: "" }); setMsg({ type: "success", text: "News published" }); refreshData(); } } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleDeleteNews = async (id: number) => { try { await fetch(`/api/news?id=${id}`, { method: "DELETE" }); refreshData(); } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleStartEditNews = (item: NewsItem) => { setEditNewsId(item.id); setEditNewsTitle(item.title); setEditNewsContent(item.content); };
  const handleCancelEditNews = () => { setEditNewsId(null); setEditNewsTitle(""); setEditNewsContent(""); };
  const handleSaveEditNews = async () => { try { const res = await fetch("/api/news", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editNewsId, title: editNewsTitle, content: editNewsContent }) }); if (res.ok) { setMsg({ type: "success", text: "News updated" }); handleCancelEditNews(); refreshData(); } else { const d = await res.json(); setMsg({ type: "error", text: d.error || "Failed to update" }); } } catch { setMsg({ type: "error", text: "Network error" }); } };
  const handleToggleAttendance = async (meetingId: number, alumniId: number, current: number) => { try { await fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ meeting_id: meetingId, alumni_id: alumniId, attended: current ? 0 : 1 }) }); refreshData(); } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleTogglePaid = async (alumniId: number, year: number, month: number, paid: number) => { try { await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alumni_id: alumniId, year, month, paid: paid ? 0 : 1 }) }); refreshData(); } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handleConfirmPayment = async (alumniId: number, year: number, month: number) => { try { await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ alumni_id: alumniId, year, month, paid: 1, confirmed: 1 }) }); refreshData(); } catch { setMsg({ type: "error", text: "Failed" }); } };
  const handlePublishResults = async () => { try { const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "results_published", value: resultsPublished ? "false" : "true" }) }); if (res.ok) { setResultsPublished(!resultsPublished); setMsg({ type: "success", text: resultsPublished ? "Results unpublished" : "Results published to homepage!" }); } } catch { setMsg({ type: "error", text: "Failed" }); } };

  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-gray to-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-brand-blue/10" />
            <div className="absolute inset-0 rounded-full border-[3px] border-t-brand-blue animate-spin" />
          </div>
          <span className="text-sm text-gray-400 font-medium tracking-wide">Loading admin panel</span>
        </div>
      </div>
    );
  }

  const totalPaid = allPayments.filter(p => p.paid).length;
  const totalConfirmed = allPayments.filter(p => p.confirmed).length;
  const totalAttended = attendance.filter(a => a.attended).length;
  const totalVotes = turnout.voted;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-brand-gray/30 to-white">
      {/* ─── MOBILE SIDEBAR OVERLAY ─── */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ─── SIDEBAR ─── */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-white border-r border-gray-200/80 shadow-lg shadow-gray-200/30 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
          <img src="/logo.jpeg" alt="" className="h-9 w-9 rounded-full border-2 border-brand-blue/10 object-cover" />
          <div>
            <p className="text-sm font-bold text-brand-blue tracking-tight">Admin Panel</p>
            <p className="text-[10px] text-gray-400 capitalize">{user?.role.replace("_", " ")}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); setSidebarOpen(false); }}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                tab === item.key
                  ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                  : "text-gray-500 hover:bg-brand-blue/5 hover:text-brand-blue"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
          <a
            href="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-brand-blue/5 hover:text-brand-blue transition-all duration-300 mt-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </a>
        </nav>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 min-w-0">
        {/* ─── HEADER ─── */}
        <header className="sticky top-0 z-20 border-b border-gray-200/60 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight hidden sm:block">{navItems.find(n => n.key === tab)?.label || "Admin"}</h1>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === "super_admin" && (
                <span className="rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-3 py-1 text-[11px] font-semibold text-amber-700">Super Admin</span>
              )}
              <a href="/settings" className="btn-ghost text-xs flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </a>
              <button onClick={handleLogout} className="btn-ghost text-xs">Sign Out</button>
            </div>
          </div>
        </header>

        {/* ─── MOBILE HORIZONTAL NAV ─── */}
        <div className="lg:hidden border-b border-gray-200/60 bg-white/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 px-4 py-2 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => { setTab(item.key); setSidebarOpen(false); }}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tab === item.key
                    ? "bg-brand-blue text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
            <a href="/settings" className="flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
          </div>
        </div>

        <div className="px-4 lg:px-6 py-5 max-w-7xl mx-auto">
          {msg.text && (
            <div className={`mb-5 rounded-xl border p-4 text-sm flex items-center justify-between transition-all ${
              msg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-600"
            }`}>
              <span className="flex items-center gap-2">
                {msg.type === "success" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                )}
                {msg.text}
              </span>
              <button onClick={() => setMsg({ type: "", text: "" })} className="ml-4 text-current opacity-50 hover:opacity-100">&times;</button>
            </div>
          )}

          {/* ─── ANALYTICS ─── */}
          {tab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Alumni", value: users.length, icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766", color: "from-brand-blue to-blue-700", shadow: "shadow-blue-200" },
                  { label: "Votes Cast", value: totalVotes, icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-emerald-500 to-green-600", shadow: "shadow-green-200" },
                  { label: "Attendance", value: totalAttended, suffix: `/${attendance.length}`, icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "from-brand-blue/80 to-blue-600", shadow: "shadow-blue-200" },
                  { label: "Turnout", value: `${turnout.percentage}%`, icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z", color: "from-amber-400 to-yellow-600", shadow: "shadow-amber-200" },
                ].map((stat, i) => (
                  <div key={stat.label} className="rounded-2xl border border-gray-100/80 bg-white p-5 shadow-sm hover:shadow-lg hover:shadow-gray-200/40 transition-all duration-500 hover:-translate-y-0.5" style={{ animation: `fadeUp 0.5s ease-out ${i * 0.08}s forwards`, opacity: 0 }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{stat.label}</span>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-sm ${stat.shadow}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                        </svg>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                      {stat.value}
                      {stat.suffix && <span className="text-base font-normal text-gray-400 ml-1">{stat.suffix}</span>}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Vote Counts by Position</h2>
                {voteResults.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">No votes have been cast yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {positions.map((pos) => {
                      const posResults = voteResults.filter((r) => r.position_id === pos.id);
                      if (posResults.length === 0) return null;
                      const maxVotes = Math.max(...posResults.map((r) => r.votes));
                      return (
                        <div key={pos.id}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-800">{pos.title}</h3>
                            <span className="text-[10px] text-gray-400 font-medium">{posResults.reduce((s, r) => s + r.votes, 0)} votes</span>
                          </div>
                          <div className="space-y-1.5">
                            {posResults.map((r) => (
                              <div key={r.aspirant_id} className="flex items-center gap-3">
                                <span className="w-32 sm:w-44 text-sm text-gray-600 truncate">{r.aspirant_name}</span>
                                <div className="flex-1">
                                  <div className="h-6 w-full rounded-lg bg-gray-100 overflow-hidden">
                                    <div className={`h-full rounded-lg transition-all duration-700 ${r.votes === maxVotes && maxVotes > 0 ? "bg-gradient-to-r from-brand-blue to-blue-600" : "bg-gradient-to-r from-gray-300 to-gray-400"}`} style={{ width: maxVotes > 0 ? `${(r.votes / maxVotes) * 100}%` : 0 }} />
                                  </div>
                                </div>
                                <span className="w-8 text-right text-sm font-bold text-gray-800">{r.votes}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── RESULTS ─── */}
          {tab === "results" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Publish Results</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Make election results visible on the homepage</p>
                  </div>
                  <button onClick={handlePublishResults} className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${resultsPublished ? "bg-green-500" : "bg-gray-300"}`}>
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${resultsPublished ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </div>
                <div className={`rounded-xl border p-4 text-sm ${resultsPublished ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                  {resultsPublished ? "Results are published and visible to all visitors on the homepage." : "Results are hidden. Toggle the switch above to publish."}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Voter Turnout</h2>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-brand-blue">{turnout.percentage}%</p>
                    <p className="text-xs text-gray-400 mt-1">Turnout</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-blue to-blue-600 transition-all duration-1000" style={{ width: `${turnout.percentage}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">{turnout.voted} of {turnout.total} alumni voted</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Results by Position</h2>
                {voteResults.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">No votes have been cast yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {positions.map((pos) => {
                      const posResults = voteResults.filter((r) => r.position_id === pos.id);
                      if (posResults.length === 0) return null;
                      const maxVotes = Math.max(...posResults.map((r) => r.votes));
                      return (
                        <div key={pos.id}>
                          <h3 className="text-sm font-semibold text-gray-800 mb-2">{pos.title}</h3>
                          <div className="space-y-1.5">
                            {posResults.map((r) => (
                              <div key={r.aspirant_id} className="flex items-center gap-3">
                                <span className="w-32 sm:w-44 text-sm text-gray-600 truncate">{r.aspirant_name}</span>
                                <div className="flex-1">
                                  <div className="h-6 w-full rounded-lg bg-gray-100 overflow-hidden">
                                    <div className={`h-full rounded-lg transition-all duration-700 ${r.votes === maxVotes && maxVotes > 0 ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-gray-300 to-gray-400"}`} style={{ width: maxVotes > 0 ? `${(r.votes / maxVotes) * 100}%` : 0 }} />
                                  </div>
                                </div>
                                <span className="w-8 text-right text-sm font-bold text-gray-800">{r.votes}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── USERS ─── */}
          {tab === "users" && (
            <div className="rounded-2xl border border-gray-100/80 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">All Alumni <span className="text-gray-400 font-normal">({users.length})</span></h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">#</th>
                      <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider"></th>
                      <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Role</th>
                      {user?.role === "super_admin" && <th className="px-4 py-3.5 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                        <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-3">
                          {u.profile_picture ? (
                            <img src={u.profile_picture} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-gray-100" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-blue to-blue-700 flex items-center justify-center text-[10px] font-bold text-white">
                              {u.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("")}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800 text-sm">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{u.email}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{u.phone_no || "-"}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{u.location || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
                            u.role === "super_admin" ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200" : u.role === "admin" ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200" : "bg-gray-100 text-gray-700"
                          }`}>{u.role.replace("_", " ")}</span>
                        </td>
                        {user?.role === "super_admin" && u.role !== "super_admin" && (
                          <td className="px-4 py-3">
                            {u.role === "admin" ? (
                              <button onClick={() => handleRoleChange(u.id, "user")} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors">Remove Admin</button>
                            ) : (
                              <button onClick={() => handleRoleChange(u.id, "admin")} className="text-xs font-medium text-brand-blue hover:text-blue-700 transition-colors">Make Admin</button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── ATTENDANCE ─── */}
          {tab === "attendance" && (
            <div className="rounded-2xl border border-gray-100/80 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Attendance Matrix</h2>
                <span className="text-[11px] text-gray-400 font-medium">{meetings.length} meetings</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="sticky left-0 bg-gray-50/50 z-10 px-3 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Alumni</th>
                      {meetings.map((m) => (
                        <th key={m.id} className="px-2 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider text-center min-w-[80px]">
                          <div>{new Date(m.meeting_date).toLocaleDateString("en", { month: "short", day: "numeric" })}</div>
                          <div className="text-[10px] text-gray-400 font-normal truncate max-w-[80px]">{m.title}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                        <td className="sticky left-0 bg-white hover:bg-gray-50/50 z-10 px-3 py-2.5 text-xs font-medium text-gray-700 whitespace-nowrap">{u.name}</td>
                        {meetings.map((m) => {
                          const record = attendance.find((a) => a.alumni_id === u.id && a.meeting_id === m.id);
                          const attended = record?.attended || 0;
                          return (
                            <td key={m.id} className="px-2 py-2.5 text-center">
                              <button onClick={() => handleToggleAttendance(m.id, u.id, attended)} className={`h-6 w-6 rounded-md border transition-all ${attended ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" : "border-gray-300 hover:border-gray-400 bg-white"}`}>
                                {attended ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 mx-auto">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                ) : null}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── PAYMENTS ─── */}
          {tab === "payments" && (
            <div className="rounded-2xl border border-gray-100/80 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Payments Management</h2>
                <span className="text-[11px] text-gray-400 font-medium">{new Date().getFullYear()} &middot; {totalPaid} paid, {totalConfirmed} confirmed</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="sticky left-0 bg-gray-50/50 z-10 px-3 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider">Alumni</th>
                      {months.map((m, i) => (
                        <th key={i} className="px-2 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider text-center min-w-[56px]">{m}</th>
                      ))}
                      <th className="px-2 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider text-center min-w-[56px]">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const currentYear = new Date().getFullYear();
                      const userPayments = allPayments.filter((p) => p.alumni_id === u.id && p.year === currentYear);
                      const paidCount = userPayments.filter((p) => p.paid).length;
                      const progress = Math.round((paidCount / 12) * 100);
                      return (
                        <tr key={u.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
                          <td className="sticky left-0 bg-white hover:bg-gray-50/50 z-10 px-3 py-2.5 text-xs font-medium text-gray-700 whitespace-nowrap">{u.name}</td>
                          {months.map((_, mi) => {
                            const payment = userPayments.find((p) => p.month === mi + 1);
                            const paid = payment?.paid || 0;
                            const confirmed = payment?.confirmed || 0;
                            return (
                              <td key={mi} className="px-2 py-2.5 text-center">
                                <div className="flex items-center justify-center gap-0.5">
                                  <button onClick={() => handleTogglePaid(u.id, currentYear, mi + 1, paid)} className={`h-5 w-5 rounded border transition-all ${paid ? "bg-amber-400 border-amber-400 text-white" : "border-gray-300 hover:border-gray-400 bg-white"}`} title={paid ? "Mark unpaid" : "Mark paid"}>
                                    {paid ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 mx-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    ) : null}
                                  </button>
                                  {paid && !confirmed && (
                                    <button onClick={() => handleConfirmPayment(u.id, currentYear, mi + 1)} className="h-4 w-4 rounded-full border border-green-300 bg-white text-green-500 hover:bg-green-50 flex items-center justify-center" title="Confirm">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-2.5 h-2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                                      </svg>
                                    </button>
                                  )}
                                  {paid && confirmed && (
                                    <span className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm" title="Confirmed">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-2.5 h-2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-2 py-2.5 text-center">
                            <span className={`text-xs font-bold ${progress >= 80 ? "text-emerald-600" : progress >= 50 ? "text-amber-600" : "text-red-500"}`}>{progress}%</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── POSITIONS ─── */}
          {tab === "positions" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Current Positions</h2>
                {positions.length === 0 ? (
                  <p className="text-gray-400 text-sm">No positions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {positions.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{p.title}</p>
                          {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Add Position</h2>
                <form onSubmit={handleAddPosition} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                    <input className="input" placeholder="e.g. President" value={newPosition.title} onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                    <input className="input" placeholder="Brief description" value={newPosition.description} onChange={(e) => setNewPosition({ ...newPosition, description: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-primary w-full">Add Position</button>
                </form>
              </div>
            </div>
          )}

          {/* ─── ASPIRANTS ─── */}
          {tab === "aspirants" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Aspirants</h2>
                {aspirants.length === 0 ? (
                  <p className="text-gray-400 text-sm">No aspirants yet.</p>
                ) : (
                  <div className="space-y-2">
                    {aspirants.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-3.5">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{a.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{a.position_title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleClearAspirant(a.id, a.cleared)} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${a.cleared ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}>
                            {a.cleared ? "Cleared" : "Clear"}
                          </button>
                          <button onClick={() => handleDeleteAspirant(a.id)} className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors px-3 py-1.5">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Add Aspirant</h2>
                <form onSubmit={handleAddAspirant} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                    <input className="input" placeholder="Full name" value={newAspirant.name} onChange={(e) => setNewAspirant({ ...newAspirant, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Position</label>
                    <select className="input" value={newAspirant.position_id} onChange={(e) => setNewAspirant({ ...newAspirant, position_id: e.target.value })} required>
                      <option value="">Select position</option>
                      {positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="btn-primary w-full">Add Aspirant</button>
                </form>
              </div>
            </div>
          )}

          {/* ─── NEWS ─── */}
          {tab === "news" && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Published News</h2>
                {news.length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-center rounded-2xl border border-gray-100/80 bg-white">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-7 h-7 text-gray-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">No news published yet.</p>
                  </div>
                ) : (
                  news.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-gray-100/80 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
                      {editNewsId === item.id ? (
                        <div className="space-y-3">
                          <input className="input text-sm" value={editNewsTitle} onChange={(e) => setEditNewsTitle(e.target.value)} placeholder="Title" />
                          <textarea className="input min-h-[120px] resize-y text-sm" value={editNewsContent} onChange={(e) => setEditNewsContent(e.target.value)} placeholder="Content" />
                          <div className="flex gap-2 justify-end">
                            <button onClick={handleCancelEditNews} className="btn-ghost text-xs">Cancel</button>
                            <button onClick={handleSaveEditNews} className="btn-primary text-xs">Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                              <p className="mt-1 text-[11px] text-gray-400">{new Date(item.created_at).toLocaleDateString()} by {item.created_by_name}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => handleStartEditNews(item)} className="text-xs font-medium text-brand-blue hover:text-blue-700 transition-colors">Edit</button>
                              <button onClick={() => handleDeleteNews(item.id)} className="text-xs font-medium text-red-400 hover:text-red-600 transition-colors">Delete</button>
                            </div>
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm text-gray-600 leading-relaxed">{item.content.substring(0, 200)}{item.content.length > 200 ? "..." : ""}</p>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900 mb-5">Publish News</h2>
                <form onSubmit={handleAddNews} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                    <input className="input" placeholder="News title" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
                    <textarea className="input min-h-[140px] resize-y" placeholder="Write your news content..." value={newNews.content} onChange={(e) => setNewNews({ ...newNews, content: e.target.value })} required />
                  </div>
                  <button type="submit" className="btn-primary w-full">Publish</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <ChangePasswordModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}
