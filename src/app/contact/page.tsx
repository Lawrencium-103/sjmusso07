"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] pt-28 pb-16">
        <div className="absolute inset-0">
          <div
            className="absolute top-10 left-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl"
            style={{ animation: "float 8s ease-in-out infinite alternate" }}
          />
          <div
            className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            style={{ animation: "float 10s ease-in-out infinite alternate-reverse" }}
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full bg-brand-gold/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold mb-4 border border-brand-gold/20">
            Contact
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            Contact Us
          </h1>
          <p className="text-white/60 text-base max-w-lg mx-auto leading-relaxed">
            Have a question or suggestion? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="section-tag mb-4 inline-block">Reach Out</span>
            <h2 className="section-title mb-6">Get In Touch</h2>
            <div className="space-y-5 text-base text-gray-600">
              <div className="flex items-start gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue shrink-0 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Address</p>
                  <p className="text-gray-500">Ikare Road, Owo, Ondo State, Nigeria</p>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue shrink-0 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">General Email</p>
                  <a href="mailto:sjmusso07@gmail.com" className="text-brand-blue hover:text-blue-700 transition-colors">
                    sjmusso07@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue shrink-0 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Coordinator</p>
                  <a href="mailto:oluyemi.akinmusire@gmail.com" className="text-brand-blue hover:text-blue-700 transition-colors">
                    oluyemi.akinmusire@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue shrink-0 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Phone</p>
                  <p className="text-gray-500">+234 706 296 9992</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-64 sm:h-72">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.641553134597!2d5.586472!3d7.197459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104f5b3c8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sSaint%20John%2FMary&#39;s%20Unity%20Secondary%20School!5e0!3m2!1sen!2sng!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              />
            </div>
          </div>

          <div>
            {sent ? (
              <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-700 mb-1">
                  Message Sent!
                </h3>
                <p className="text-base text-green-600">
                  Thank you for reaching out. We&apos;ll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <span className="section-tag mb-4 inline-block">Send a Message</span>
                <h2 className="section-title mb-6">Drop Us a Line</h2>
                <div>
                  <label className="label mb-1.5">Your Name</label>
                  <input
                    className="input"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="label mb-1.5">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="label mb-1.5">Message</label>
                  <textarea
                    className="input min-h-[130px] resize-y"
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-base"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Send Message
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
