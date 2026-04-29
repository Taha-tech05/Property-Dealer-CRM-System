"use client";
import { useEffect, useState } from "react";

const icons = {
  created:       { emoji: "✨", color: "emerald" },
  status_change: { emoji: "🔄", color: "blue" },
  assigned:      { emoji: "👤", color: "yellow" },
  note:          { emoji: "📝", color: "gray" },
  followup_set:  { emoji: "📅", color: "purple" },
};

export default function ActivityTimeline({ leadId }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch(`/api/lead/${leadId}/activity`)
      .then(r => r.json())
      .then(setActivities);
  }, [leadId]);

  return (
    <div className="space-y-3">
      {activities.map((a) => {
        const { emoji, color } = icons[a.type] || icons.note;
        return (
          <div key={a._id} className="flex gap-3 items-start">
            <span className="text-lg mt-0.5">{emoji}</span>
            <div className="flex-1">
              <p className="text-sm text-white">{a.message}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {a.actor?.name ?? "System"} · {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        );
      })}
      {activities.length === 0 && <p className="text-gray-500 text-sm">No activity yet.</p>}
    </div>
  );
}