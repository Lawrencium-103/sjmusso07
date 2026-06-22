"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "question" | "reset" | "done">(
    "email"
  );
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alumniId, setAlumniId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "__verify_question__" }),
      });
      if (res.status !== 426) {
        setError("Email not found");
        return;
      }
      const data = await res.json();
      setQuestion(data.security_question);
      setAlumniId(data.alumni_id);
      setStep("question");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!answer.trim()) {
      setError("Please provide your answer");
      return;
    }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "__check_answer__",
          security_answer: answer.toLowerCase().trim(),
        }),
      });
      if (res.status === 426) {
        setError("Incorrect answer. Please try again.");
        return;
      }
      const data = await res.json();
      if (data.verified) {
        setStep("reset");
      } else {
        setError("Incorrect answer. Please try again.");
      }
    } catch {
      setError("Network error");
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "__reset_password__",
          new_password: newPassword,
          alumni_id: alumniId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Reset failed");
        return;
      }
      setStep("done");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] px-4 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
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
              Reset Password
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {step === "email" && "Enter your registered email"}
              {step === "question" && "Answer your security question"}
              {step === "reset" && "Create a new password"}
              {step === "done" && "All set!"}
            </p>
          </div>

          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}
              <div>
                <label className="label mb-1.5">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Checking...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          )}

          {step === "question" && (
            <form onSubmit={handleAnswerSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}
              <div>
                <label className="label mb-1.5">Security Question</label>
                <div className="rounded-xl bg-brand-blue/5 border border-brand-blue/10 p-3.5 text-sm font-medium text-brand-blue">
                  {question}
                </div>
              </div>
              <div>
                <label className="label mb-1.5">Your Answer</label>
                <input
                  className="input"
                  placeholder="Enter your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full py-2.5">
                Verify Answer
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}
              <div>
                <label className="label mb-1.5">New Password</label>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="label mb-1.5">Confirm Password</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Your password has been reset successfully.
              </p>
              <button
                onClick={() => router.push("/login")}
                className="btn-primary w-full py-2.5"
              >
                Sign In with New Password
              </button>
            </div>
          )}

          <p className="mt-5 text-center text-sm text-gray-400">
            <a
              href="/login"
              className="text-brand-blue hover:text-blue-700 transition-colors font-medium"
            >
              Back to Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
