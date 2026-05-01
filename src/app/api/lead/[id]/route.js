import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { logActivity } from "@/lib/activity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const lead = await Lead.findById(id)
      .populate("assignedTo", "name email")
      .lean();
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(JSON.parse(JSON.stringify(lead)));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const actorId = session?.user?.id ?? null;

    // Fetch existing lead to compare for activity logging
    const existing = await Lead.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: { ...body, lastActivityAt: new Date() } },
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const serialized = JSON.parse(JSON.stringify(updatedLead));

    // Log status change
    if (body.status && body.status !== existing.status) {
      await logActivity(
        id,
        actorId,
        "status_change",
        `Status changed from ${existing.status} to ${body.status}`,
        { from: existing.status, to: body.status }
      );
    }

    // Log notes update
    if (body.notes !== undefined && body.notes !== existing.notes) {
      await logActivity(id, actorId, "note", `Notes updated`);
    }

    // Emit real-time events
    if (global.io) {
      global.io.to("admin").emit("lead:updated", serialized);
      if (serialized.assignedTo?._id) {
        global.io
          .to(`agent:${serialized.assignedTo._id}`)
          .emit("lead:updated", serialized);
      }
    }

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("FULL ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;

    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (global.io) {
      global.io.to("admin").emit("lead:deleted", { _id: id });
      if (deleted.assignedTo) {
        global.io
          .to(`agent:${deleted.assignedTo}`)
          .emit("lead:deleted", { _id: id });
      }
    }

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}