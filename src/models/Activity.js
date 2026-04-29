import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  lead:    { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  actor:   { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who did it
  type:    { type: String, enum: ["created", "status_change", "assigned", "note", "followup_set"], required: true },
  message: { type: String, required: true },
  meta:    { type: mongoose.Schema.Types.Mixed }, // e.g. { from: "New", to: "Contacted" }
}, { timestamps: true });

export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);