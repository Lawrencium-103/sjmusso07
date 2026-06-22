"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_no: "",
    gender: "",
    location: "",
    occupation: "",
    password: "",
    security_question: "What is your mother's maiden name?",
    security_answer: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] px-4 py-8 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-lg">
        <div className="rounded-2xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl shadow-black/20 border border-white/10">
          <div className="mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src="/logo.jpeg"
                  alt="Logo"
                  className="h-16 w-16 rounded-2xl border-2 border-brand-blue/20 object-cover shadow-lg"
                />
                <div className="absolute -inset-0.5 rounded-2xl bg-brand-blue/5" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-brand-blue tracking-tight">
              Join the Alumni
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Register as a new member
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-sm text-green-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}
            <div>
              <label className="label mb-1.5">Full Name *</label>
              <input
                name="name"
                className="input"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label mb-1.5">Email *</label>
                <input
                  name="email"
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label mb-1.5">Phone *</label>
                <input
                  name="phone_no"
                  className="input"
                  placeholder="08012345678"
                  value={form.phone_no}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label mb-1.5">Gender *</label>
                <select
                  name="gender"
                  className="input"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="label mb-1.5">Location</label>
                <input
                  name="location"
                  className="input"
                  placeholder="City, State"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="label mb-1.5">Occupation</label>
              <input
                name="occupation"
                className="input"
                placeholder="Your occupation"
                value={form.occupation}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label mb-1.5">Password *</label>
              <PasswordInput
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password (min 6 chars)"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="label mb-1.5">Security Question</label>
              <input
                name="security_question"
                className="input bg-gray-50"
                value={form.security_question}
                readOnly
              />
            </div>
            <div>
              <label className="label mb-1.5">Security Answer *</label>
              <input
                name="security_answer"
                className="input"
                placeholder="Your mother's maiden name"
                value={form.security_answer}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-brand-blue hover:text-blue-700 transition-colors font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
