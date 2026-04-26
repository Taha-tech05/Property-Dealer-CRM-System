"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      const res = await fetch("/api/auth/session");
      const session = await res.json();
      router.push(session?.user?.role === "admin" ? "/admin/dashboard" : "/agent/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d0f14] font-sans">

      {/* LEFT PANEL */}
      <div className="hidden md:flex relative w-[55%] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0f14]/90 via-[#0d0f14]/50 to-[#0d0f14]/70" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div className="flex items-center gap-2 text-[#c9a84c] text-xl font-bold tracking-wide">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            PropCRM
          </div>
          <div>
            <h1 className="text-white font-bold text-5xl leading-tight mb-4">
              Your Leads.<br />Your Empire.
            </h1>
            <p className="text-white/60 text-sm font-light mb-10 tracking-wide">
              Pakistan's most intelligent property CRM
            </p>
            <div className="flex gap-3 flex-wrap">
              {[["1,200+", "Leads Managed"], ["48", "Active Agents"], ["Rs2.4B", "Pipeline"]].map(([val, label]) => (
                <div key={label} className="bg-[#0d0f14]/75 border border-[#c9a84c]/25 backdrop-blur-md rounded-xl px-5 py-3">
                  <div className="text-[#c9a84c] font-bold text-xl">{val}</div>
                  <div className="text-white/50 text-[10px] uppercase tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 border-l border-[#1e2330]">
        <div className="w-full max-w-sm">

          <div className="flex items-center gap-2 text-[#c9a84c] text-lg font-bold mb-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            PropCRM
          </div>

          <h2 className="text-[#f0f4ff] font-bold text-3xl mb-2">Welcome Back</h2>
          <p className="text-[#8b92a9] text-sm font-light mb-8">Sign in to access your dashboard</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#8b92a9] text-xs font-medium uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#161a22] border border-[#2a3045] rounded-lg px-4 py-3 text-sm text-[#f0f4ff] placeholder-[#4a5168] outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-[#8b92a9] text-xs font-medium uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <div className="text-right mt-2">
                <a href="#" className="text-xs text-[#8b92a9] hover:text-[#c9a84c] transition-colors">Forgot password?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] hover:bg-[#d4b35a] disabled:opacity-60 text-[#0d0f14] font-semibold rounded-lg py-3.5 text-sm tracking-wide transition-all hover:shadow-[0_4px_20px_rgba(201,168,76,0.3)] active:scale-[0.99] cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-[#4a5168] mt-8">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#c9a84c] font-medium hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}