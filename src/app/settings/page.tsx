"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface AlumniUser {
  id: number; name: string; email: string; phone_no: string;
  role: string; gender: string; location: string; occupation: string;
  profile_picture: string; must_change_password: number;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AlumniUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", phone_no: "", gender: "", location: "", occupation: "",
  });
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) { router.replace("/login"); return; }
        setUser(data.user);
        setForm({
          name: data.user.name || "",
          phone_no: data.user.phone_no || "",
          gender: data.user.gender || "",
          location: data.user.location || "",
          occupation: data.user.occupation || "",
        });
        setPreview(data.user.profile_picture || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error || "Failed to save" }); return; }
      setUser(data.user);
      setMsg({ type: "success", text: "Profile updated successfully" });
    } catch {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: "error", text: "File too large (max 5MB)" });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setMsg({ type: "error", text: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);
    setMsg({ type: "", text: "" });

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/auth/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error || "Upload failed" }); return; }
      setPreview(data.profile_picture);
      setMsg({ type: "success", text: "Profile picture updated" });
    } catch {
      setMsg({ type: "error", text: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

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
          <span className="text-sm text-gray-400 font-medium tracking-wide">Loading settings</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/">
              <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 rounded-full border-2 border-brand-blue/10 object-cover transition-transform hover:scale-105" />
            </a>
            <div>
              <h1 className="text-lg font-bold text-brand-blue tracking-tight">SJMUSSO &apos;07</h1>
              <p className="text-xs text-gray-400">Account Settings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={user?.role === "super_admin" || user?.role === "admin" ? "/admin" : "/dashboard"} className="btn-ghost text-xs">Back</a>
            <button onClick={handleLogout} className="btn-ghost text-xs">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        {msg.text && (
          <div className={`mb-6 rounded-xl border p-4 text-sm flex items-center justify-between transition-all ${
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

        <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                {preview ? (
                  <img src={preview} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-brand-blue to-blue-700 flex items-center justify-center text-white text-3xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                </div>
              )}
            </div>
            <div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-primary text-sm"
              >
                {uploading ? "Uploading..." : "Change Photo"}
              </button>
              <p className="text-xs text-gray-400 mt-1.5">JPEG, PNG, WebP, GIF. Max 5MB.</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Personal Information</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="label mb-1.5">Full Name</label>
              <input name="name" className="input" value={form.name} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label mb-1.5">Phone Number</label>
                <input name="phone_no" className="input" value={form.phone_no} onChange={handleChange} />
              </div>
              <div>
                <label className="label mb-1.5">Gender</label>
                <select name="gender" className="input" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label mb-1.5">Location</label>
                <input name="location" className="input" value={form.location} onChange={handleChange} placeholder="City, State" />
              </div>
              <div>
                <label className="label mb-1.5">Occupation</label>
                <input name="occupation" className="input" value={form.occupation} onChange={handleChange} placeholder="Your occupation" />
              </div>
            </div>
            <div>
              <label className="label mb-1.5">Email</label>
              <input className="input bg-gray-50" value={user?.email || ""} disabled />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <a href={user?.role === "super_admin" || user?.role === "admin" ? "/admin" : "/dashboard"} className="btn-ghost">Cancel</a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
