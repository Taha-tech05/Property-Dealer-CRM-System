"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "agent" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d0f14] font-sans">

      {/* LEFT PANEL */}
      <div className="hidden md:flex relative w-[45%] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0f14]/92 via-[#0d0f14]/50 to-[#0d0f14]/80" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-2 text-[#c9a84c] text-xl font-bold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            PropCRM
          </div>
          <div>
            <h1 className="text-white font-bold text-4xl leading-tight mb-4">
              Manage Every Lead.<br />Close Every Deal.
            </h1>
            <p className="text-white/55 text-sm font-light leading-relaxed mb-8">
              Join Pakistan's leading real estate CRM. Streamline your pipeline and never miss a high-value opportunity.
            </p>
            <div className="flex flex-col gap-3.5">
              {[
                "Centralized leads from Facebook, walk-ins & website",
                "Smart priority scoring based on budget",
                "Real-time updates and follow-up reminders",
                "WhatsApp & email integration built-in",
              ].map((f) => (
                <div key={f} className="flex items-start gap-3 text-white/70 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] mt-1.5 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 border-l border-[#1e2330]">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 text-[#c9a84c] text-lg font-bold mb-9">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            PropCRM
          </div>

          <h2 className="text-[#f0f4ff] font-bold text-3xl mb-2">Create Account</h2>
          <p className="text-[#8b92a9] text-sm font-light mb-8">Set up your CRM access in seconds</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-[#8b92a9] text-xs font-medium uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Muhammad Ali"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-[#161a22] border border-[#2a3045] rounded-lg px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4a5168] outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#8b92a9] text-xs font-medium uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@agency.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-[#161a22] border border-[#2a3045] rounded-lg px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4a5168] outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#8b92a9] text-xs font-medium uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full bg-[#161a22] border border-[#2a3045] rounded-lg px-4 py-3 pr-11 text-sm text-[#f0f4ff] placeholder-[#4a5168] outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5168] hover:text-[#8b92a9] transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-[#8b92a9] text-xs font-medium uppercase tracking-wider mb-3">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "agent", label: "Agent", desc: "Manage assigned leads",
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  },
                  {
                    value: "admin", label: "Admin", desc: "Full system access",
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  }
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`flex items-start gap-3 p-4 rounded-lg border text-left transition-all cursor-pointer ${
                      formData.role === role.value
                        ? "border-[#c9a84c] bg-[#c9a84c]/6"
                        : "border-[#2a3045] bg-[#161a22] hover:border-[#4a5168]"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] flex-shrink-0">
                      {role.icon}
                    </div>
                    <div>
                      <div className="text-[#f0f4ff] text-sm font-semibold">{role.label}</div>
                      <div className="text-[#4a5168] text-xs mt-0.5">{role.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#d4b35a] disabled:opacity-60 text-[#0d0f14] font-semibold rounded-lg py-3.5 text-sm tracking-wide transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)] active:scale-[0.99] cursor-pointer mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-[#4a5168] mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#c9a84c] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}