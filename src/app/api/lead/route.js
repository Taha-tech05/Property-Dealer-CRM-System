import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { sendNewLeadEmail } from "@/lib/mailer";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        const lead = await Lead.create(body);
        const populated = await Lead.findById(lead._id)
            .populate("assignedTo", "name email")
            .lean();

        const serialized = JSON.parse(JSON.stringify(populated));

        // Emit real-time event to all admins
        if (global.io) {
            global.io.to("admin").emit("lead:new", serialized);
            if (serialized.assignedTo?._id) {
                global.io.to(`agent:${serialized.assignedTo._id}`).emit("lead:new", serialized);
            }
        }
        await sendNewLeadEmail(serialized).catch(console.error); // .catch so it never breaks the response
        await logActivity(lead._id, null, "created", `Lead "${lead.name}" was created via ${lead.source}`);

        return NextResponse.json(serialized, { status: 201 });
    } catch (error) {
        console.error("Lead creation error:", error.message, error); // add full error
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}