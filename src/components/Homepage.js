import { Link } from "react-router-dom";
import { ArrowRight, Layers, Zap, Eye } from "lucide-react";

export default function Homepage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="pb-20 pt-24 md:pt-32">
        <div className="max-w-2xl">
          <div className="mb-5 inline-block rounded-full border border-blue-400/30 bg-blue-400/8 px-3 py-1 text-[13px] font-medium text-blue-400 font-mono">
            v1.0 — internshala automation
          </div>
          <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.1] tracking-tight text-balance">
            Apply to internships while you sleep.
          </h1>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-gray-600">
            One profile. One cover letter. Dozens of applications — submitted automatically across Internshala. No more copy-paste marathons.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <Link to="/register">
              <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-100 bg-blue-400 rounded-md hover:bg-blue-500 transition-colors duration-200">
                Start automating <ArrowRight className="ml-1 h-4 w-4" />
              </button>
            </Link>
            <Link to="/login">
              <button className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Log in
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-200 pb-20 pt-16">
        <p className="mb-10 text-[13px] font-medium uppercase tracking-widest text-gray-500">
          How it works
        </p>
        <div className="grid gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 md:grid-cols-3">
          {[
            {
              step: "01",
              icon: Layers,
              title: "Enter your details",
              desc: "Choose the internship role you want and write a short cover letter. That's all the input needed.",
            },
            {
              step: "02",
              icon: Zap,
              title: "We do the rest",
              desc: "Our automation browses Internshala, finds every matching listing, and submits your application — page by page.",
            },
            {
              step: "03",
              icon: Eye,
              title: "Track outcomes",
              desc: "See every application in your dashboard — company, role, date, and status — all in one place.",
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white p-8">
              <span className="font-mono text-[13px] text-gray-400">{item.step}</span>
              <div className="mt-4 mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <item.icon className="h-[18px] w-[18px] text-gray-700" />
              </div>
              <h3 className="text-[15px] font-semibold">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 py-16 text-center">
        <p className="text-[15px] text-gray-600">Ready to stop the grind?</p>
        <Link to="/register">
          <button className="mt-4 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-blue-100 bg-blue-400 rounded-md hover:bg-blue-500 transition-colors duration-200">
            Create free account <ArrowRight className="ml-1 h-4 w-4" />
          </button>
        </Link>
      </section>
    </div>
  );
}
