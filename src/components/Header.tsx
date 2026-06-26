"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const hiddenPaths = ["/dashboard", "/admin", "/settings", "/vote"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-lg shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <img
              src="/logo.jpeg"
              alt="SJMUSSO"
              className={`h-9 w-9 rounded-full object-cover transition-all duration-500 ${
                scrolled
                  ? "border-2 border-brand-blue shadow-sm"
                  : "border-2 border-white/80 shadow-lg shadow-black/20"
              }`}
            />
            <div className={`absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
              scrolled ? "bg-brand-blue/10" : "bg-white/10"
            }`} />
          </div>
          <span
            className={`text-base font-bold tracking-tight transition-all duration-500 ${
              scrolled ? "text-brand-blue" : "text-white"
            }`}
          >
            SJMUSSO &apos;07
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {[
            ["Home", "/"],
            ["About", "/about"],
            ["Contact", "/contact"],
          ].map(([label, href]) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive
                    ? scrolled
                      ? "text-brand-blue bg-brand-blue/5"
                      : "text-white bg-white/10"
                    : scrolled
                    ? "text-gray-600 hover:text-brand-blue hover:bg-brand-blue/5"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-brand-gold" />
                )}
              </Link>
            );
          })}
          <div className="ml-4 flex items-center gap-2.5">
            {user ? (
              <>
                <Link
                  href={user.role === "super_admin" || user.role === "admin" ? "/admin" : "/dashboard"}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                    scrolled
                      ? "bg-brand-blue text-white hover:bg-blue-700"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {user.role === "super_admin" || user.role === "admin" ? "Admin" : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                    scrolled
                      ? "border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500"
                      : "border-white/40 text-white/80 hover:border-white/60 hover:text-white"
                  }`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                    scrolled
                      ? "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white hover:shadow-lg hover:shadow-brand-blue/20"
                      : "border-white/40 text-white hover:bg-white/15"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-brand-gold px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 hover:bg-yellow-600 hover:shadow-lg hover:shadow-brand-gold/25"
                >
                  Join
                </Link>
              </>
            )}
          </div>
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
            scrolled
              ? "text-brand-blue hover:bg-brand-blue/5"
              : "text-white hover:bg-white/10"
          }`}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100/80 bg-white/95 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col gap-1 px-4 py-3">
            {[
              ["Home", "/"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  pathname === href
                    ? "bg-brand-blue/10 text-brand-blue"
                    : "text-gray-600 hover:bg-gray-50 hover:text-brand-blue"
                }`}
              >
                {label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            {user ? (
              <>
                <Link
                  href={user.role === "super_admin" || user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-brand-blue px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 transition-all duration-200"
                >
                  {user.role === "super_admin" || user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="rounded-lg border border-gray-300 px-3 py-2.5 text-center text-sm font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg border border-brand-blue px-3 py-2.5 text-center text-sm font-medium text-brand-blue hover:bg-brand-blue hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg bg-brand-gold px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-yellow-600 transition-all duration-200"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
