import NavItem from "@/components/NavItem";
import StatCard from "@/components/StatCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminDashboard() {

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    redirect("/login");
  }

  // 2. Direct Database Access
  await connectDB();

  const [totalLeads, highPriority, closedLeads, openLeads, totalAgents] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ score: "High" }),
    Lead.countDocuments({ status: "Closed" }),
    Lead.countDocuments({ status: { $ne: "Closed" } }),
    User.countDocuments({ role: "agent" }),
  ]);
  const allLeads = await Lead.find({})

    .populate("assignedTo", "name email") // Only fetch name and email of the agent

    .sort({ createdAt: -1 }) // Newest first

    .lean();

  // Add this line before passing to the component
  const serializedLeads = JSON.parse(JSON.stringify(allLeads));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0f111a] text-white">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-[#161922]">
        <h1 className="text-xl font-bold text-yellow-500">PropCRM</h1>
        <div className="text-white text-xs font-semibold bg-yellow-600 px-3 py-1 rounded-full">Admin</div>
      </div>

      {/* Sidebar - Left (Hidden on Mobile) */}
      <aside className="hidden md:block w-64 bg-[#161922] border-r border-gray-800 p-6 sticky top-0 h-screen">
        <h1 className="text-xl font-bold text-yellow-500 mb-10">PropCRM</h1>
        <nav className="space-y-4">
          <NavItem icon="Dashboard" label="Dashboard" active />
        </nav>
      </aside>

      {/* Main Content - Right */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
          <div className="hidden md:flex gap-2">
            {/* Admin/Agent Toggle visible in your image */}
            <button className="bg-yellow-600 px-4 py-1 rounded-full text-xs">Admin</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Leads" value={totalLeads} color="emerald" />
          <StatCard label="High Priority" value={highPriority} color="red" />
          <StatCard label="Open Leads" value={openLeads} color="amber" />
          <StatCard label="Closed Leads" value={closedLeads} color="blue" />
          <StatCard label="Total Agents" value={totalAgents} color="purple" />
        </div>

        {/* Charts & Tables Section */}
        <AdminDashboardClient initialLeads={serializedLeads} />
      </main>
    </div>
  );
}