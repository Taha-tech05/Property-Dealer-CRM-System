import Link from "next/link";

const features = [
  {
    title: "Smart Lead Scoring",
    desc: "Automatically score leads based on budget, source, and engagement. High-priority leads rise to the top instantly.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  },
  {
    title: "Agent Assignment",
    desc: "Assign and reassign leads to agents in seconds. Each agent sees only their pipeline — no confusion, no overlap.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
  {
    title: "Real-Time Updates",
    desc: "Live dashboard updates via Socket.io. Know the moment a lead changes status — without refreshing.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    title: "WhatsApp Integration",
    desc: "One-click to open WhatsApp with the lead's number pre-filled. Never copy phone numbers manually again.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  },
  {
    title: "Follow-up Reminders",
    desc: "Set follow-up dates per lead. Stale and overdue leads are flagged automatically in your dashboard.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    title: "Analytics Dashboard",
    desc: "Full visibility into lead distribution, agent performance, and pipeline value — all in one admin view.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0d0f14] text-[#f0f4ff] font-sans overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 py-5 bg-[#0d0f14]/80 backdrop-blur-md border-b border-[#2a3045]/60">
        <Link href="/" className="flex items-center gap-2 text-[#c9a84c] text-xl font-bold">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          PropCRM
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="border border-[#2a3045] hover:border-[#c9a84c] hover:text-[#c9a84c] rounded-lg px-5 py-2.5 text-sm font-medium text-[#f0f4ff] transition-all">
            Sign In
          </Link>
          <Link href="/signup" className="flex items-center gap-1.5 bg-[#c9a84c] hover:bg-[#d4b35a] text-[#0d0f14] font-semibold rounded-lg px-5 py-2.5 text-sm transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)]">
            Get Started
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1600&q=80')", backgroundPositionY: "30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f14]/97 via-[#0d0f14]/80 to-[#0d0f14]/40" />
        <div className="relative z-10 max-w-2xl px-16 pt-32 pb-20">
          <div className="inline-flex items-center gap-2 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-full px-4 py-1.5 text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
            Pakistan's #1 Property CRM
          </div>
          <h1 className="font-bold text-6xl leading-[1.05] mb-6 tracking-tight">
            Your Leads.<br />
            <span className="text-[#c9a84c] italic">Your Empire.</span>
          </h1>
          <p className="text-[#8b92a9] text-lg font-light leading-relaxed mb-12 max-w-xl">
            The most intelligent CRM for Pakistani property dealers. Manage leads from Facebook Ads, walk-ins, and website inquiries — all in one powerful platform.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/signup" className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#d4b35a] text-[#0d0f14] font-semibold rounded-lg px-8 py-4 text-sm transition-all hover:shadow-[0_8px_30px_rgba(201,168,76,0.35)] hover:-translate-y-0.5">
              Start Free Today
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className="flex items-center gap-2 border border-[#2a3045] hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#f0f4ff] font-medium rounded-lg px-8 py-4 text-sm transition-all">
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-[#161a22] border-y border-[#2a3045]">
        <div className="max-w-5xl mx-auto grid grid-cols-4">
          {[["1,200+", "Leads Managed"], ["48", "Active Agents"], ["Rs2.4B", "Pipeline Value"], ["23%", "Avg. Close Rate"]].map(([val, label], i) => (
            <div key={label} className={`py-8 px-10 text-center ${i < 3 ? "border-r border-[#2a3045]" : ""}`}>
              <div className="text-[#c9a84c] font-bold text-3xl mb-1.5">{val}</div>
              <div className="text-[#4a5168] text-xs uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="max-w-5xl mx-auto px-16 py-24">
        <div className="text-[#c9a84c] text-xs font-semibold uppercase tracking-[3px] mb-4">Why PropCRM</div>
        <h2 className="font-bold text-4xl text-[#f0f4ff] mb-4 leading-tight max-w-lg">Everything a property dealer needs</h2>
        <p className="text-[#8b92a9] text-base font-light leading-relaxed max-w-lg mb-16">
          Built specifically for the Pakistani real estate market. Handles every stage of the lead lifecycle from capture to close.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-[#161a22] border border-[#2a3045] hover:border-[#c9a84c]/30 hover:-translate-y-0.5 rounded-xl p-7 transition-all">
              <div className="w-11 h-11 bg-[#c9a84c]/10 rounded-xl flex items-center justify-center text-[#c9a84c] mb-5">
                {f.icon}
              </div>
              <div className="text-[#f0f4ff] font-semibold text-sm mb-2.5">{f.title}</div>
              <div className="text-[#8b92a9] text-xs font-light leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden bg-[#161a22] border-y border-[#2a3045]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-16 py-24 text-center">
          <h2 className="font-bold text-5xl text-[#f0f4ff] mb-5 leading-tight">Ready to close more deals?</h2>
          <p className="text-[#8b92a9] text-base font-light leading-relaxed mb-10">
            Join hundreds of Pakistani property agents who manage their pipeline smarter with PropCRM.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#d4b35a] text-[#0d0f14] font-semibold rounded-lg px-9 py-4 text-sm transition-all hover:shadow-[0_8px_30px_rgba(201,168,76,0.35)]">
              Create Free Account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/login" className="border border-[#2a3045] hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#f0f4ff] font-medium rounded-lg px-9 py-4 text-sm transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex items-center justify-between px-16 py-8 border-t border-[#1e2330]">
        <Link href="/" className="flex items-center gap-2 text-[#c9a84c] text-base font-bold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
          PropCRM
        </Link>
        <div className="text-[#4a5168] text-xs">© 2025 PropCRM. Built for Pakistani real estate.</div>
        <div className="flex gap-6">
          <Link href="/login" className="text-[#4a5168] hover:text-[#c9a84c] text-xs transition-colors">Login</Link>
          <Link href="/signup" className="text-[#4a5168] hover:text-[#c9a84c] text-xs transition-colors">Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}