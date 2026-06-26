export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#043a7a] via-brand-blue to-[#032a5a] pt-28 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 bg-brand-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <span className="inline-block rounded-full bg-brand-gold/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-gold mb-4 border border-brand-gold/20">
            About
          </span>
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-3 tracking-tight">
            About Us
          </h1>
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Saint John/Mary&apos;s Unity Secondary School, Owo — 2007 Alumni
            Association
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20 space-y-12 sm:space-y-16">
        <section>
          <div className="max-w-3xl">
            <span className="section-tag mb-4 inline-block">Our Story</span>
            <h2 className="section-title mb-6">How It All Began</h2>
          </div>
          <div className="space-y-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            <p>
              The SJMUSSO &apos;07 Alumni Association is a registered body of
              graduates from Saint John/Mary&apos;s Unity Secondary School, Owo,
              Ondo State, Nigeria. We are the 2007 graduating
              class — bound together by a shared history and a common vision for
              the future of our alma mater.
            </p>
            <p>
              Since leaving the walls of SJMUSSO, we have branched out across
              Nigeria and the world, excelling in diverse fields including
              education, healthcare, business, technology, law, and public
              service. Despite the distance, our commitment to the values
              instilled in us remains unwavering.
            </p>
            <p>
              This digital platform was launched in 2026 to formalize our
              association, streamline communication, and provide a transparent
              system for governance, contributions, and event management.
            </p>
          </div>
        </section>

        <section>
          <span className="section-tag mb-4 inline-block">Mission</span>
          <h2 className="section-title mb-6">What Drives Us</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Unity",
                desc: "To foster a strong, inclusive community among all 2007 alumni, regardless of location or background.",
                icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
              },
              {
                title: "Development",
                desc: "To contribute meaningfully to the growth and development of Saint John/Mary's Unity Secondary School.",
                icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-1.5 0h-9m9 0h.75m-12.75 0h.75",
              },
              {
                title: "Legacy",
                desc: "To preserve and celebrate the legacy of our set for future generations of alumni.",
                icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
              },
              {
                title: "Transparency",
                desc: "To ensure open, accountable governance through digital tools and clear communication channels.",
                icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-brand-blue/5 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue mb-4 transition-all duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-brand-blue mb-1 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <span className="section-tag mb-4 inline-block">School Info</span>
          <h2 className="section-title mb-6">School Information</h2>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["School Name", "Saint John/Mary's Unity Secondary School"],
                  ["Location", "Ikare Road, Owo, Ondo State, Nigeria"],
                  ["Motto", "To Know, To Love, To Serve"],
                  ["Set", "2007 Graduating Class"],
                  ["Association", "SJMUSSO '07 Alumni Association"],
                ].map(([label, value], i) => (
                  <tr
                    key={label}
                    className={`border-b border-gray-100 last:border-0 transition-colors hover:bg-brand-blue/[0.02] ${
                      i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-700 w-44">
                      {label}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border border-amber-200/60 p-8 sm:p-12 shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-200/20 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,transparent_30%,rgba(251,191,36,0.03)_100%)]" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                  </svg>
                </div>
                <div>
                  <span className="section-tag inline-block">School Anthem</span>
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div className="relative pl-6 border-l-4 border-brand-gold/40">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic font-serif">
                    &ldquo;To the praise, honor, and glory of our dear, great benefactor,
                  </p>
                </div>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic font-serif pl-6">
                  We raise our beautiful anthem to laud the land of true knowledge.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic font-serif pl-6">
                  Raise the anthem, ye O students,
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic font-serif pl-6">
                  To be echoed by the present.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic font-serif pl-6">
                  We will sing the glory of our dear benefactor, St. John/Mary!&rdquo;
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-200/50">
                <p className="text-xs text-amber-700/60 uppercase tracking-widest font-medium">
                  — Anthem of Saint John/Mary&apos;s Unity Secondary School, Owo
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
