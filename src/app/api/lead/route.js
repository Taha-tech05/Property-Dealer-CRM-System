import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { logActivity } from "@/lib/activity";
import { sendNewLeadEmail } from "@/lib/mailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const session = await getServerSession(authOptions);

        const lead = await Lead.create(body);
        const populated = await Lead.findById(lead._id)
            .populate("assignedTo", "name email")
            .lean();

        const serialized = JSON.parse(JSON.stringify(populated));

        // Emit real-time event
        if (global.io) {
            global.io.to("admin").emit("lead:new", serialized);
            if (serialized.assignedTo?._id) {
                global.io
                    .to(`agent:${serialized.assignedTo._id}`)
                    .emit("lead:new", serialized);
            }
        }

        // Send email & log activity
        await sendNewLeadEmail(serialized).catch(console.error);
        await logActivity(
            lead._id,
            session?.user?.id ?? null,
            "created",
            `Lead "${lead.name}" was created via ${lead.source || "Unknown"}`
        );

        return NextResponse.json(serialized, { status: 201 });
    } catch (error) {
        console.error("Lead creation error:", error.message, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}