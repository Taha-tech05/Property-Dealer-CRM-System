"use client";
import { useSocket } from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ActivityTimeline from "./ActivityTimeline";

export default function LeadTable({ leads: initialLeads, isAdmin = false }) {
  const [leads, setLeads] = useState(initialLeads);
  useEffect(() => { setLeads(initialLeads); }, [initialLeads]);

  const [editingLead, setEditingLead] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [assigningLead, setAssigningLead] = useState(null);
  const [timelineLead, setTimelineLead] = useState(null); // lead._id for timeline drawer
  const { data: session } = useSession();
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const room = session?.user?.role === "admin" ? "admin" : `agent:${session?.user?.id}`;

  useSocket(room, ({ type, data }) => {
    if (type === "lead:new") {
      setLeads(prev => [data, ...prev]);
      addToast(`New lead: ${data.name}`, "green");
    }
    if (type === "lead:assigned") {
      setLeads(prev => prev.map(l => String(l._id) === String(data._id) ? data : l));
      addToast(`Lead reassigned: ${data.name}`, "yellow");
    }
    if (type === "lead:updated") {
      setLeads(prev => prev.map(l => String(l._id) === String(data._id) ? data : l));
      addToast(`Lead updated: ${data.name}`, "blue");
    }
    if (type === "lead:deleted") {
      setLeads(prev => prev.filter(l => String(l._id) !== String(data._id)));
      addToast("Lead deleted", "yellow");
    }
  });

  // ── FETCH AGENTS ──────────────────────────────────────────
  useEffect(() => {
    if (isAdmin) fetch("/api/agents").then(r => r.json()).then(setAgents);
  }, [isAdmin]);

  // ── ASSIGN ────────────────────────────────────────────────
  const handleAssign = async (leadId, agentId) => {
    setAssigningLead(leadId);
    const res = await fetch(`/api/lead/${leadId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    });
    const updated = await res.json();
    setLeads(prev => prev.map(l => String(l._id) === String(leadId) ? updated : l));
    setAssigningLead(null);
  };

  // ── DELETE ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/lead/${id}`, { method: "DELETE" });
    setLeads(prev => prev.filter(l => String(l._id) !== String(id)));
  };

  // ── EDIT ──────────────────────────────────────────────────
  const openEdit = (lead) => {
    setEditingLead(lead._id);
    setEditForm({
      name: lead.name, email: lead.email, phone: lead.phone,
      propertyInterest: lead.propertyInterest, budget: lead.budget,
      score: lead.score, status: lead.status, notes: lead.notes || "",
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    const res = await fetch(`/api/lead/${editingLead}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    if (!res.ok) { alert(`Failed: ${data.error}`); setLoading(false); return; }
    setLeads(prev => prev.map(l => String(l._id) === String(editingLead) ? data : l));
    setEditingLead(null);
    setLoading(false);
  };

  // ── FOLLOW-UP ─────────────────────────────────────────────
  const handleFollowUp = async (leadId, date) => {
    const res = await fetch(`/api/lead/${leadId}/followup`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followUpDate: date }),
    });
    const updated = await res.json();
    setLeads(prev => prev.map(l => String(l._id) === String(leadId) ? updated : l));
    addToast("Follow-up date set", "blue");
  };

  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  return (
    <>
      {/* ── TOASTS ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-lg text-sm font-medium shadow-lg transition-all
            ${t.type === "green" ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" :
              t.type === "yellow" ? "bg-yellow-500/20  border border-yellow-500/40  text-yellow-300" :
                "bg-blue-500/20    border border-blue-500/40    text-blue-300"}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* ── ACTIVITY TIMELINE DRAWER ── */}
      {timelineLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-[#1c212c] border-l border-gray-700 w-full max-w-md p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-semibold text-lg">Activity Timeline</h3>
              <button onClick={() => setTimelineLead(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <ActivityTimeline leadId={timelineLead} />
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1c212c] border border-gray-700 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-white font-semibold text-lg mb-5">Edit Lead</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
                { label: "Property Interest", key: "propertyInterest" },
                { label: "Budget", key: "budget", type: "number" },
              ].map(({ label, key, type = "text" }) => (
                <div key={key} className={key === "propertyInterest" ? "col-span-2" : ""}>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">{label}</label>
                  <input
                    type={type}
                    value={editForm[key] || ""}
                    onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Priority</label>
                <select value={editForm.score} onChange={e => setEditForm({ ...editForm, score: e.target.value })}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500">
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Status</label>
                <select value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500">
                  <option>New</option><option>Contacted</option><option>In Progress</option><option>Closed</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editForm.notes || ""}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="Internal notes about this lead..."
                  className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditingLead(null)}
                className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={loading}
                className="px-5 py-2 rounded-lg text-sm bg-yellow-500 hover:bg-yellow-400 text-black font-semibold disabled:opacity-50 transition-colors">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TABLE ── */}
      <div className="bg-[#1c212c] rounded-xl border border-gray-800 overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead className="bg-[#161922] text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-4">Lead Name</th>
              <th className="p-4">Property Interest</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Priority</th>
              {isAdmin && <th className="p-4">Assigned Agent</th>}
              <th className="p-4">Status</th>
              <th className="p-4">Follow-up</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {leads.map(lead => {
              const cleanPhone = lead.phone?.replace(/\D/g, "");
              const isOverdue = lead.followUpDate && new Date(lead.followUpDate) < now && lead.status !== "Closed";
              const isStale = lead.lastActivityAt && new Date(lead.lastActivityAt) < sevenDaysAgo && lead.status !== "Closed";

              return (
                <tr key={lead._id} className={`transition-colors text-sm
                  ${isOverdue ? "bg-red-500/5 border-l-2 border-l-red-500" :
                    isStale ? "bg-yellow-500/5 border-l-2 border-l-yellow-500" :
                      "hover:bg-[#1f2431]"}`}>

                  {/* NAME */}
                  <td className="p-4">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="text-gray-500 text-xs">{lead.email}</div>
                    {isOverdue && <span className="text-[10px] text-red-400 font-semibold">⚠ Overdue follow-up</span>}
                    {!isOverdue && isStale && <span className="text-[10px] text-yellow-400 font-semibold">⏱ No activity 7d+</span>}
                  </td>

                  <td className="p-4 text-gray-300">{lead.propertyInterest}</td>
                  <td className="p-4 text-white font-bold">Rs {lead.budget / 1000000}M</td>

                  {/* PRIORITY */}
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold
                      ${lead.score === "High" ? "bg-red-500/10 text-red-500" :
                        lead.score === "Medium" ? "bg-orange-500/10 text-orange-500" :
                          "bg-gray-500/10 text-gray-400"}`}>
                      ● {lead.score}
                    </span>
                  </td>

                  {/* ASSIGN */}
                  {isAdmin && (
                    <td className="p-4">
                      <select
                        value={lead.assignedTo?._id || ""}
                        disabled={assigningLead === lead._id}
                        onChange={e => handleAssign(lead._id, e.target.value)}
                        className="bg-[#0f111a] border border-gray-700 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-yellow-500 disabled:opacity-50">
                        <option value="">Unassigned</option>
                        {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                      </select>
                      {assigningLead === lead._id && <span className="text-gray-500 text-xs ml-2">Saving...</span>}
                    </td>
                  )}

                  {/* STATUS */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs
                      ${lead.status === "Closed" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"}`}>
                      {lead.status}
                    </span>
                  </td>

                  {/* FOLLOW-UP DATE */}
                  <td className="p-4">
                    <input
                      type="date"
                      defaultValue={lead.followUpDate ? new Date(lead.followUpDate).toISOString().split("T")[0] : ""}
                      onChange={e => handleFollowUp(lead._id, e.target.value)}
                      className={`bg-[#0f111a] border rounded px-2 py-1 text-xs text-white outline-none focus:border-yellow-500
                        ${isOverdue ? "border-red-500/50" : "border-gray-700"}`}
                    />
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4">
                    <div className="flex gap-3 text-gray-400 items-center">
                      <a href={`https://wa.me/${cleanPhone}`} target="_blank" rel="noopener noreferrer"
                        className="text-emerald-500 hover:text-emerald-400" title="WhatsApp">💬</a>

                      {/* Timeline button — visible to everyone */}
                      <button onClick={() => setTimelineLead(lead._id)}
                        className="hover:text-purple-400 transition-colors" title="Activity Timeline">🕐</button>

                      {isAdmin && (
                        <>
                          <button onClick={() => openEdit(lead)} className="hover:text-yellow-400 transition-colors" title="Edit">✏️</button>
                          <button onClick={() => handleDelete(lead._id)} className="hover:text-red-500 transition-colors" title="Delete">🗑️</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {leads.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">No leads found.</div>
        )}
      </div>
    </>
  );
}