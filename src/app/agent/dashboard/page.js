"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import StatCard from "@/components/StatCard";
import LeadTable from "@/components/LeadTable";

export default function AgentDashboard() {
    const { data: session } = useSession();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial leads
    useEffect(() => {
        if (!session?.user?.id) return;

        fetch("/api/agents/leads")
            .then(r => r.json())
            .then(data => {
                setLeads(data);
                setLoading(false);
            });
    }, [session?.user?.id]);

    // Live updates via socket
    useSocket(session?.user?.id ? `agent:${session.user.id}` : null, ({ type, data }) => {
        if (type === "lead:new") {
            // Only add if assigned to this agent
            if (data.assignedTo?._id === session.user.id || data.assignedTo === session.user.id) {
                setLeads(prev => [data, ...prev]);
            }
        }
        if (type === "lead:updated" || type === "lead:assigned") {
            setLeads(prev => {
                const exists = prev.find(l => l._id === data._id);
                if (exists) return prev.map(l => l._id === data._id ? data : l);
                // New assignment to this agent
                return [data, ...prev];
            });
        }
    });

    const overdueCount = leads.filter(
        l => l.followUpDate && new Date(l.followUpDate) < new Date() && l.status !== "Closed"
    ).length;

    const closedThisMonth = leads.filter(l => {
        if (l.status !== "Closed") return false;
        const closed = new Date(l.updatedAt);
        const now = new Date();
        return closed.getMonth() === now.getMonth() && closed.getFullYear() === now.getFullYear();
    }).length;

    if (loading) return <div className="p-8 bg-[#0f111a] min-h-screen text-white">Loading...</div>;

    return (
        <div className="p-8 bg-[#0f111a] min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-2">My Leads</h1>
            <p className="text-gray-400 mb-8 text-sm">Agent View</p>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard label="My Assigned Leads" value={leads.length} color="emerald" />
                <StatCard label="Overdue Follow-ups" value={overdueCount} color="amber" />
                <StatCard label="Closed This Month" value={closedThisMonth} color="emerald" />
            </div>

            <h2 className="text-xl font-semibold mb-4">My Lead List</h2>
            <LeadTable leads={leads} />
            {overdueCount > 0 && (
                <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    ⚠️ You have <strong>{overdueCount}</strong> overdue follow-up{overdueCount > 1 ? "s" : ""}. Check highlighted leads below.
                </div>
            )}
        </div>

    );
}