// app/api/agent/leads/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const leads = await Lead.find({ assignedTo: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(JSON.parse(JSON.stringify(leads)));
}