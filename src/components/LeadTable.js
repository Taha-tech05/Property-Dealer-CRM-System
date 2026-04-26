export default function LeadTable({ leads }) {
  return (
    <div className="bg-[#1c212c] rounded-xl border border-gray-800 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#161922] text-gray-400 text-xs uppercase">
          <tr>
            <th className="p-4">Lead Name</th>
            <th className="p-4">Property Interest</th>
            <th className="p-4">Budget</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-[#1f2431] transition-colors text-sm">
              <td className="p-4">
                <div className="font-medium text-white">{lead.name}</div>
                <div className="text-gray-500 text-xs">{lead.email}</div>
              </td>
              <td className="p-4 text-gray-300">{lead.propertyInterest}</td>
              <td className="p-4 text-white font-bold">Rs {lead.budget / 1000000}M</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                  lead.score === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  ● {lead.score}
                </span>
              </td>
              <td className="p-4">
                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs">
                  {lead.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex gap-3 text-gray-400">
                   {/* WhatsApp Logic Here */}
                   <a href={`https://wa.me/${lead.phone}`} className="text-emerald-500 hover:text-emerald-400">💬</a>
                   <button className="hover:text-white">👁️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}