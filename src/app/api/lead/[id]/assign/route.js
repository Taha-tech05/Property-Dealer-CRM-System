import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { logActivity } from "@/lib/activity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { sendAssignmentEmail } from "@/lib/mailer";

export async function PUT(req, context) {
    try {
        await connectDB();
        const { id } = await context.params;
        const { agentId } = await req.json();
        const session = await getServerSession(authOptions);

        // Fetch agent details for logging/email
        const agent = agentId ? await User.findById(agentId).lean() : null;

        const updated = await Lead.findByIdAndUpdate(
            id,
            { assignedTo: agentId || null, lastActivityAt: new Date() },
            { new: true }
        ).populate("assignedTo", "name email");

        if (!updated) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        const serialized = JSON.parse(JSON.stringify(updated));

        // Emit real-time events
        if (global.io) {
            global.io.to("admin").emit("lead:assigned", serialized);
            if (serialized.assignedTo?._id) {
                global.io
                    .to(`agent:${serialized.assignedTo._id}`)
                    .emit("lead:assigned", serialized);
            }
        }

        // Send email notification
        if (serialized.assignedTo) {
            await sendAssignmentEmail(serialized, serialized.assignedTo).catch(
                console.error
            );
        }

        // Log activity
        const actorId = session?.user?.id ?? null;
        const agentName = agent?.name ?? "Unassigned";
        await logActivity(
            id,
            actorId,
            "assigned",
            agentId
                ? `Lead assigned to ${agentName}`
                : "Lead unassigned",
            agent ? { agentId: agent._id, agentName: agent.name } : {}
        );

        return NextResponse.json(serialized);
    } catch (error) {
        console.error("Assign error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}