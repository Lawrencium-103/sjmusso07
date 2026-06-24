"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-brand-blue text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <img
                  src="/logo.jpeg"
                  alt="SJMUSSO"
                  className="h-11 w-11 rounded-full border-2 border-white/30 object-cover shadow-lg"
                />
                <div className="absolute -inset-0.5 rounded-full bg-white/5" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                SJMUSSO &apos;07
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Saint John/Mary&apos;s Unity Secondary School, Owo — 2007 Alumni
              Association.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-brand-gold/80">
              Quick Links
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                ["Home", "/"],
                ["About Us", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-white/60 hover:text-white transition-all duration-200 hover:translate-x-0.5"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-brand-gold/80">
              Account
            </h3>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/login"
                className="text-sm text-white/60 hover:text-white transition-all duration-200 hover:translate-x-0.5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm text-white/60 hover:text-white transition-all duration-200 hover:translate-x-0.5"
              >
                Register
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold mb-4 uppercase tracking-[0.15em] text-brand-gold/80">
              Contact
            </h3>
            <div className="flex flex-col gap-2 text-sm text-white/60">
              <span>Ikare Road, Owo</span>
              <span>Ondo State, Nigeria</span>
              <a
                href="mailto:sjmusso07@gmail.com"
                className="hover:text-white transition-all duration-200 hover:translate-x-0.5 inline-block"
              >
                sjmusso07@gmail.com
              </a>
              <a
                href="mailto:oluyemi.akinmusire@gmail.com"
                className="hover:text-white transition-all duration-200 hover:translate-x-0.5 inline-block text-white/40 text-[11px]"
              >
                Coordinator: oluyemi.akinmusire@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} SJMUSSO &apos;07 Alumni Association.
            All rights reserved.
          </p>
          <p className="italic text-white/30 text-xs">
            &ldquo;To Know, To Love, To Serve&rdquo;
          </p>
          <p className="text-[10px] text-white/20">
            Built by{" "}
            <a
              href="https://joblin-hx5a.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white/40 transition-colors"
            >
              Joblin&apos;s Builder
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
