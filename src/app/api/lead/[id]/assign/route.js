import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { sendAssignmentEmail } from "@/lib/mailer";

export async function PUT(req, context) {
    await connectDB();
    const { id } = await context.params;
    const { agentId } = await req.json();

    const updated = await Lead.findByIdAndUpdate(
        id,
        { assignedTo: agentId || null },
        { new: true }
    ).populate("assignedTo", "name email");
    if (body.status && body.status !== existingLead.status) {
        await logActivity(id, session.user.id, "status_change",
            `Status changed from ${existingLead.status} to ${body.status}`,
            { from: existingLead.status, to: body.status }
        );
    }
    const serialized = JSON.parse(JSON.stringify(updated));

    if (global.io) {
        global.io.to("admin").emit("lead:assigned", serialized);
        // Also notify the specific agent
        if (serialized.assignedTo?._id) {
            global.io.to(`agent:${serialized.assignedTo._id}`).emit("lead:updated", serialized);
        }
    }
    if (serialized.assignedTo) {
        await sendAssignmentEmail(serialized, serialized.assignedTo).catch(console.error);
    }

    await logActivity(id, session.user.id, "assigned",
        `Lead assigned to ${agent.name}`,
        { agentId: agent._id, agentName: agent.name }
    );
    return NextResponse.json(serialized);
}