"use client";
import { useState } from "react";
import LeadTable from "./LeadTable";
import CreateLeadModal from "./CreateLeadModal";

export default function AdminDashboardClient({ initialLeads }) {
  const [showCreate, setShowCreate] = useState(false);
  const [leads, setLeads] = useState(initialLeads);

  const handleCreated = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  return (
    <>
      {showCreate && (
        <CreateLeadModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold">All Leads</h3>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          + New Lead
        </button>
      </div>

      <LeadTable leads={leads} isAdmin={true} />
    </>
  );
}