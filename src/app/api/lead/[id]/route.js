import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function PUT(req, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await req.json();

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }  // ← new: true, not returnDocument
    ).populate("assignedTo", "name email");

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const serialized = JSON.parse(JSON.stringify(updatedLead));

    if (global.io) {
      global.io.to("admin").emit("lead:updated", serialized);
      if (serialized.assignedTo?._id) {
        global.io.to(`agent:${serialized.assignedTo._id}`).emit("lead:updated", serialized);
      }
    }

    return NextResponse.json(serialized);
  } catch (error) {
    console.log("FULL ERROR:", error);
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
        global.io.to(`agent:${deleted.assignedTo}`).emit("lead:deleted", { _id: id });
      }
    }

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}