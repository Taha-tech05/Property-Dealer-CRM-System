import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  const agents = await User.find({ role: "agent" }, "name email");
  return NextResponse.json(agents);
}