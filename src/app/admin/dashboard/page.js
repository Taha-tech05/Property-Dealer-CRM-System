"use client";
import NavItem from "@/components/NavItem";
import StatCard from "@/components/StatCard";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-[#0f111a] text-white">
      {/* Sidebar - Left */}
      <aside className="w-64 bg-[#161922] border-r border-gray-800 p-6">
        <h1 className="text-xl font-bold text-yellow-500 mb-10">PropCRM</h1>
        <nav className="space-y-4">
          <NavItem icon="Dashboard" label="Dashboard" active />
          <NavItem icon="Leads" label="Leads" />
          {/* ...other links */}
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
           <StatCard label="Total Leads" value="1,248" trend="+12%" color="emerald" />
           <StatCard label="High Priority" value="87" color="red" />
           {/* ...other cards */}
        </div>
        
        {/* Charts & Tables Section */}
        {/* ... */}
      </main>
    </div>
  );
}