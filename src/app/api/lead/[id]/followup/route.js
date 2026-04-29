import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { logActivity } from "@/lib/activity";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PUT(req, context) {
  await connectDB();
  const { id } = await context.params;
  const { followUpDate } = await req.json();
  const session = await getServerSession(authOptions);

  const lead = await Lead.findByIdAndUpdate(
    id,
    { followUpDate, lastActivityAt: new Date() },
    { new: true }
  );

  await logActivity(id, session.user.id, "followup_set",
    `Follow-up set for ${new Date(followUpDate).toLocaleDateString()}`
  );

  return NextResponse.json(JSON.parse(JSON.stringify(lead)));
}