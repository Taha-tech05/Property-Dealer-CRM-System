"use client";
import { useState, useEffect } from "react";
import LeadTable from "./LeadTable";
import CreateLeadModal from "./CreateLeadModal";

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const colors = {
    red: "bg-red-500",
    orange: "bg-orange-500",
    gray: "bg-gray-500",
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
  };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-[#0f111a] rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full ${colors[color] || "bg-yellow-500"} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 w-12 text-right">
        {value} <span className="text-gray-600">({pct}%)</span>
      </span>
    </div>
  );
}

export default function AdminDashboardClient({ initialLeads }) {
  const [showCreate, setShowCreate] = useState(false);
  const [leads, setLeads] = useState(initialLeads);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        setAnalytics(data);
        setLoadingAnalytics(false);
      })
      .catch(() => setLoadingAnalytics(false));
  }, []);

  const handleCreated = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  // Apply client-side filters
  const filteredLeads = leads.filter((l) => {
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterPriority && l.score !== filterPriority) return false;
    if (filterDate) {
      const created = new Date(l.createdAt).toISOString().split("T")[0];
      if (created !== filterDate) return false;
    }
    return true;
  });

  const totalLeads = analytics?.totalLeads ?? leads.length;
  const statusDist = analytics?.statusDist ?? {};
  const priorityDist = analytics?.priorityDist ?? {};
  const agentPerformance = analytics?.agentPerformance ?? [];

  const exportLeads = (format) => {
    if (format === "pdf") {
      window.open(`/api/lead/export?format=pdf`, "_blank");
    } else {
      window.location.href = `/api/lead/export?format=xlsx`;
    }
  };

  return (
    <>
      {showCreate && (
        <CreateLeadModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {/* ── Analytics Section ── */}
      {!loadingAnalytics && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Status Distribution */}
          <div className="bg-[#1c212c] border border-gray-800 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-white mb-4">
              Lead Status Distribution
            </h4>
            <div className="space-y-3">
              {[
                { label: "New", key: "New", color: "blue" },
                { label: "Contacted", key: "Contacted", color: "amber" },
                { label: "In Progress", key: "In Progress", color: "purple" },
                { label: "Closed", key: "Closed", color: "emerald" },
              ].map(({ label, key, color }) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{label}</span>
                  </div>
                  <ProgressBar
                    value={statusDist[key] ?? 0}
                    max={totalLeads}
                    color={color}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-[#1c212c] border border-gray-800 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-white mb-4">
              Priority Distribution
            </h4>
            <div className="space-y-4">
              {[
                {
                  key: "High",
                  color: "bg-red-500/10 text-red-400 border border-red-500/20",
                  icon: "🔴",
                },
                {
                  key: "Medium",
                  color:
                    "bg-orange-500/10 text-orange-400 border border-orange-500/20",
                  icon: "🟠",
                },
                {
                  key: "Low",
                  color:
                    "bg-gray-500/10 text-gray-400 border border-gray-500/20",
                  icon: "⚪",
                },
              ].map(({ key, color, icon }) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg ${color}`}
                >
                  <span className="text-sm font-medium">
                    {icon} {key} Priority
                  </span>
                  <span className="text-xl font-bold">
                    {priorityDist[key] ?? 0}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between text-xs text-gray-500">
              <span>Total Leads</span>
              <span className="text-white font-semibold">{totalLeads}</span>
            </div>
          </div>

          {/* Source Distribution */}
          <div className="bg-[#1c212c] border border-gray-800 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-white mb-4">
              Lead Sources
            </h4>
            <div className="space-y-3">
              {Object.entries(analytics.sourceDist ?? {}).map(
                ([src, count]) => (
                  <div key={src}>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{src}</span>
                    </div>
                    <ProgressBar
                      value={count}
                      max={totalLeads}
                      color="amber"
                    />
                  </div>
                )
              )}
              {Object.keys(analytics.sourceDist ?? {}).length === 0 && (
                <p className="text-gray-600 text-sm">No source data</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agent Performance Table */}
      {!loadingAnalytics && agentPerformance.length > 0 && (
        <div className="bg-[#1c212c] border border-gray-800 rounded-xl p-5 mb-8">
          <h4 className="text-sm font-semibold text-white mb-4">
            Agent Performance Overview
          </h4>
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-gray-400 uppercase">
              <tr>
                <th className="pb-3">Agent</th>
                <th className="pb-3">Assigned</th>
                <th className="pb-3">Closed</th>
                <th className="pb-3">Close Rate</th>
                <th className="pb-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {agentPerformance.map((agent) => (
                <tr key={agent._id}>
                  <td className="py-3">
                    <div className="font-medium text-white">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.email}</div>
                  </td>
                  <td className="py-3 text-gray-300">{agent.totalAssigned}</td>
                  <td className="py-3 text-emerald-400">{agent.closed}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${agent.closeRate >= 50
                          ? "bg-emerald-500/10 text-emerald-400"
                          : agent.closeRate >= 25
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      {agent.closeRate}%
                    </span>
                  </td>
                  <td className="py-3 w-40">
                    <ProgressBar
                      value={agent.closed}
                      max={agent.totalAssigned}
                      color="emerald"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Lead Table Controls ── */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h3 className="text-white font-semibold text-lg">
          All Leads{" "}
          <span className="text-gray-500 text-sm font-normal">
            ({filteredLeads.length})
          </span>
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filters */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1c212c] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-yellow-500"
          >
            <option value="">All Statuses</option>
            <option>New</option>
            <option>Contacted</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#1c212c] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-yellow-500"
          >
            <option value="">All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-[#1c212c] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-yellow-500"
          />

          {(filterStatus || filterPriority || filterDate) && (
            <button
              onClick={() => {
                setFilterStatus("");
                setFilterPriority("");
                setFilterDate("");
              }}
              className="text-xs text-gray-500 hover:text-yellow-400 transition-colors"
            >
              Clear ✕
            </button>
          )}

          {/* Export buttons */}
          <button
            onClick={() => exportLeads("xlsx")}
            className="flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/40 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            ⬇ XLSX
          </button>
          <button
            onClick={() => exportLeads("pdf")}
            className="flex items-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/40 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            🖨 PDF
          </button>

          <button
            onClick={() => setShowCreate(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            + New Lead
          </button>
        </div>
      </div>

      <LeadTable leads={filteredLeads} isAdmin={true} />
    </>
  );
}