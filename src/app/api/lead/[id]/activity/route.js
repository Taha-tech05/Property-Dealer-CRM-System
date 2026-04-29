import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";

export async function GET(req, context) {
  await connectDB();
  const { id } = await context.params;
  const activities = await Activity.find({ lead: id })
    .populate("actor", "name")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(JSON.parse(JSON.stringify(activities)));
}