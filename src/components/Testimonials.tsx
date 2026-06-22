export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "This platform has brought our class closer than ever. I can finally reconnect with friends I hadn't heard from in years.",
      name: "Agunbiade Ayobami Ademola",
      location: "Lagos",
    },
    {
      quote:
        "The alumni association has been instrumental in fostering unity and giving back to our dear school.",
      name: "Mrs Akintola Temitope Mary",
      location: "Akure",
    },
    {
      quote:
        "Being able to participate in elections and contribute to the association from anywhere in the world is amazing.",
      name: "Olowojesiku Busayo",
      location: "South Africa",
    },
    {
      quote:
        "The reunion meeting was a beautiful experience. We are building something great together.",
      name: "Owomoyela O",
      location: "Ibadan",
    },
  ];

  return (
    <section className="relative bg-white py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#e8e9eb,transparent_60%)]" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <span className="section-tag mb-5 inline-block">Testimonials</span>
          <h2 className="section-title">Voices From Our Community</h2>
          <p className="section-subtitle mt-4">
            What our alumni are saying about the association
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group relative rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-xl hover:shadow-brand-blue/10 transition-all duration-500 hover:-translate-y-2 hover:border-brand-blue/20"
              style={{
                animation: `bounceIn 0.6s ease-out ${i * 0.12}s forwards`,
                opacity: 0,
              }}
            >
              <svg
                className="mb-4 h-7 w-7 text-brand-gold/30 group-hover:text-brand-gold/50 transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg text-gray-600 leading-relaxed mb-5 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-blue-700 text-xs font-bold text-white shrink-0 shadow-md">
                    {t.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="text-base font-bold text-gray-800 leading-tight">
                      {t.name}
                    </p>
                    <p className="text-sm text-gray-400">{t.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
