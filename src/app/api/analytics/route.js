import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await connectDB();

        // Status distribution
        const statusAgg = await Lead.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);
        const statusDist = {};
        statusAgg.forEach((s) => { statusDist[s._id] = s.count; });

        // Priority distribution
        const priorityAgg = await Lead.aggregate([
            { $group: { _id: "$score", count: { $sum: 1 } } },
        ]);
        const priorityDist = {};
        priorityAgg.forEach((p) => { priorityDist[p._id] = p.count; });

        // Agent performance
        const agents = await User.find({ role: "agent" }, "name email").lean();
        const agentPerformance = await Promise.all(
            agents.map(async (agent) => {
                const total = await Lead.countDocuments({ assignedTo: agent._id });
                const closed = await Lead.countDocuments({
                    assignedTo: agent._id,
                    status: "Closed",
                });
                return {
                    _id: agent._id,
                    name: agent.name,
                    email: agent.email,
                    totalAssigned: total,
                    closed,
                    closeRate: total > 0 ? Math.round((closed / total) * 100) : 0,
                };
            })
        );

        // Totals
        const totalLeads = await Lead.countDocuments();
        const openLeads = await Lead.countDocuments({ status: { $ne: "Closed" } });
        const totalAgents = agents.length;

        // Source distribution
        const sourceAgg = await Lead.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } },
        ]);
        const sourceDist = {};
        sourceAgg.forEach((s) => { sourceDist[s._id || "Unknown"] = s.count; });

        return NextResponse.json({
            totalLeads,
            openLeads,
            totalAgents,
            statusDist,
            priorityDist,
            sourceDist,
            agentPerformance,
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
