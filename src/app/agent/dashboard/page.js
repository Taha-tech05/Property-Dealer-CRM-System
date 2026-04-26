import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import StatCard from "@/components/StatCard";
import LeadTable from "@/components/LeadTable";

export default async function AgentDashboard() {
    const session = await getServerSession(authOptions);
    await connectDB();

    // ONLY fetch leads assigned to the logged-in agent
    const myLeads = await Lead.find({ assignedTo: session.user.id })
        .sort({ createdAt: -1 })
        .lean();
    // Filter for overdue follow-ups for the banner
    const overdueCount = myLeads.filter(l => l.followUpDate < new Date() && l.status !== 'Closed').length;

    return (
        <div className="p-8 bg-[#0f111a] min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-2">My Leads</h1>
            <p className="text-gray-400 mb-8 text-sm">Agent View</p>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <StatCard label="My Assigned Leads" value={myLeads.length} color="emerald" />
                <StatCard label="Overdue Follow-ups" value={overdueCount} color="amber" />
                <StatCard label="Closed This Month" value="12" color="emerald" />
            </div>

            <h2 className="text-xl font-semibold mb-4">My Lead List</h2>
            <LeadTable leads={myLeads} />
        </div>
    );
}