import NavItem from "@/components/NavItem";
import StatCard from "@/components/StatCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminDashboard() {

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    redirect("/login");
  }

  // 2. Direct Database Access
  await connectDB();

  const [totalLeads, highPriority, closedLeads] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ score: "High" }),
    Lead.countDocuments({ status: "Closed" })
  ]);
  const allLeads = await Lead.find({})

    .populate("assignedTo", "name email") // Only fetch name and email of the agent

    .sort({ createdAt: -1 }) // Newest first

    .lean();

  // Add this line before passing to the component
  const serializedLeads = JSON.parse(JSON.stringify(allLeads));

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-white">
      {/* Sidebar - Left */}
      <aside className="w-64 bg-[#161922] border-r border-gray-800 p-6">
        <h1 className="text-xl font-bold text-yellow-500 mb-10">PropCRM</h1>
        <nav className="space-y-4">
          <NavItem icon="Dashboard" label="Dashboard" active />
          <NavItem icon="Leads" label="Leads" />
        </nav>
      </aside>

      {/* Main Content - Right */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
          <div className="flex gap-2">
            {/* Admin/Agent Toggle visible in your image */}
            <button className="bg-yellow-600 px-4 py-1 rounded-full text-xs">Admin</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Leads" value={totalLeads} color="emerald" />
          <StatCard label="High Priority" value={highPriority} color="red" />
          <StatCard label="Closed Leads" value={closedLeads} color="blue" />
        </div>

        {/* Charts & Tables Section */}
        <AdminDashboardClient initialLeads={serializedLeads} />
      </main>
    </div>
  );
}