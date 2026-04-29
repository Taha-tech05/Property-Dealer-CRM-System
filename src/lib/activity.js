import Activity from "@/models/Activity";

export async function logActivity(leadId, actorId, type, message, meta = {}) {
  await Activity.create({ lead: leadId, actor: actorId, type, message, meta });
}