export default function StatCard({ label, value, trend, color }) {
  // Mapping colors to Tailwind classes
  const colorMap = {
    emerald: "text-emerald-500",
    red: "text-red-500",
    amber: "text-amber-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
  };

  return (
    <div className="bg-[#1c212c] p-6 rounded-xl border border-gray-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg bg-opacity-10 bg-current ${colorMap[color]}`}>
          {/* You can put a Lucide Icon here */}
        </div>
        {trend && (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        <p className="text-gray-400 text-sm mt-1">{label}</p>
      </div>
    </div>
  );
}