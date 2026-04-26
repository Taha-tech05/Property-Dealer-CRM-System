import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    await connectDB();

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // 2. Hash the password (CRITICAL for security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create the user
    // Note: In a real app, you might want to force 'role' to be 'agent' 
    // unless an Admin is creating the account.
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "agent", 
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}