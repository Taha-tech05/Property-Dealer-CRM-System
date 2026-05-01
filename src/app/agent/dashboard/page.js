"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import StatCard from "@/components/StatCard";
import LeadTable from "@/components/LeadTable";
import Link from "next/link";

export default function AgentDashboard() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial leads assigned to this agent
    useEffect(() => {
        if (!session?.user?.id) return;

        fetch("/api/agents/leads")
            .then(r => r.json())
            .then(data => {
                setLeads(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [session?.user?.id]);

    // Live updates via socket
    useSocket(session?.user?.id ? `agent:${session.user.id}` : null, ({ type, data }) => {
        if (type === "lead:new") {
            if (data.assignedTo?._id === session.user.id || data.assignedTo === session.user.id) {
                setLeads(prev => [data, ...prev]);
            }
        }
        if (type === "lead:updated" || type === "lead:assigned") {
            setLeads(prev => {
                const exists = prev.find(l => l._id === data._id);
                if (exists) return prev.map(l => l._id === data._id ? data : l);
                // Newly assigned to this agent
                if (data.assignedTo?._id === session?.user?.id || data.assignedTo === session?.user?.id) {
                    return [data, ...prev];
                }
                return prev;
            });
        }
        if (type === "lead:deleted") {
            setLeads(prev => prev.filter(l => String(l._id) !== String(data._id)));
        }
    });

    const now = new Date();
    const overdueLeads = leads.filter(
        l => l.followUpDate && new Date(l.followUpDate) < now && l.status !== "Closed"
    );
    const overdueCount = overdueLeads.length;

    const staleLeads = leads.filter(l => {
        if (l.status === "Closed") return false;
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        return l.lastActivityAt && new Date(l.lastActivityAt) < sevenDaysAgo;
    }).length;

    const closedThisMonth = leads.filter(l => {
        if (l.status !== "Closed") return false;
        const closed = new Date(l.updatedAt);
        return closed.getMonth() === now.getMonth() && closed.getFullYear() === now.getFullYear();
    }).length;

    if (loading) {
        return (
            <div className="flex min-h-screen bg-[#0f111a] items-center justify-center">
                <div className="text-white text-sm animate-pulse">Loading your leads...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#0f111a] text-white">

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-[#161922]">
                <Link href="/" className="flex items-center gap-2 text-yellow-500 text-lg font-bold">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                    PropCRM
                </Link>
                <button
                    onClick={() => import("next-auth/react").then(m => m.signOut({ callbackUrl: "/login" }))}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                    Sign out
                </button>
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-56 bg-[#161922] border-r border-gray-800 p-6 sticky top-0 h-screen">
                <Link href="/" className="flex items-center gap-2 text-yellow-500 text-lg font-bold mb-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        <polyline points="9,22 9,12 15,12 15,22" />
                    </svg>
                    PropCRM
                </Link>
                <nav className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm font-medium">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Dashboard
                    </div>
                </nav>
                <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="text-xs text-gray-500 mb-1">Logged in as</div>
                    <div className="text-sm text-white font-medium truncate">{session?.user?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{session?.user?.email}</div>
                    <button
                        onClick={() => import("next-auth/react").then(m => m.signOut({ callbackUrl: "/login" }))}
                        className="mt-3 w-full text-left text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                        Sign out →
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <div className="flex justify-between items-center mb-2">
                    <h1 className="text-2xl font-bold">My Leads</h1>
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
                        Agent View
                    </span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                    Welcome back, <span className="text-gray-300 font-medium">{session?.user?.name}</span>
                </p>

                {/* Overdue alert — ABOVE the table */}
                {overdueCount > 0 && (
                    <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>
                            You have <strong>{overdueCount}</strong> overdue follow-up{overdueCount > 1 ? "s" : ""}. Highlighted leads below need immediate attention.
                        </span>
                    </div>
                )}

                {staleLeads > 0 && (
                    <div className="mb-6 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-400 text-sm flex items-center gap-2">
                        <span className="text-lg">⏱</span>
                        <span>
                            <strong>{staleLeads}</strong> lead{staleLeads > 1 ? "s have" : " has"} had no activity in 7+ days.
                        </span>
                    </div>
                )}

                {/* Stat cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard label="My Assigned Leads" value={leads.length} color="emerald" />
                    <StatCard label="Overdue Follow-ups" value={overdueCount} color="red" />
                    <StatCard label="Stale Leads (7d+)" value={staleLeads} color="amber" />
                    <StatCard label="Closed This Month" value={closedThisMonth} color="blue" />
                </div>

                <h2 className="text-lg font-semibold mb-4">
                    My Lead List
                    <span className="text-gray-500 text-sm font-normal ml-2">({leads.length} total)</span>
                </h2>
                <LeadTable leads={leads} isAdmin={false} />

                {leads.length === 0 && (
                    <div className="text-center py-16 text-gray-600">
                        <div className="text-4xl mb-3">📋</div>
                        <div className="text-sm">No leads assigned to you yet.</div>
                        <div className="text-xs mt-1">Your admin will assign leads shortly.</div>
                    </div>
                )}
            </main>
        </div>
    );
}