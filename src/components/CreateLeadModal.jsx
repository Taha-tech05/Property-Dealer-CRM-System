"use client";
import { useState } from "react";

export default function CreateLeadModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    propertyInterest: "", budget: "",
    source: "Website Inquiry", status: "New",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.budget) {
      setError("Name, email and budget are required.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, budget: Number(form.budget) }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create lead");
      setLoading(false);
      return;
    }

    onCreated(data); // pass new lead back up
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c212c] border border-gray-700 rounded-xl w-full max-w-lg p-6">
        <h3 className="text-white font-semibold text-lg mb-5">New Lead</h3>

        {error && (
          <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Name",              key: "name" },
            { label: "Email",             key: "email" },
            { label: "Phone",             key: "phone" },
            { label: "Budget (Rs)",       key: "budget", type: "number" },
            { label: "Property Interest", key: "propertyInterest" },
          ].map(({ label, key, type = "text" }) => (
            <div key={key} className={key === "propertyInterest" ? "col-span-2" : ""}>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
            >
              <option>Facebook Ad</option>
              <option>Walk-in</option>
              <option>Website Inquiry</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-[#0f111a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
            >
              <option>New</option>
              <option>Contacted</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm bg-yellow-500 hover:bg-yellow-400 text-black font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating..." : "Create Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}