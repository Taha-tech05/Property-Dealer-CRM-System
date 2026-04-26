import Link from 'next/link';

export default function NavItem({ label, href, active }) {
  return (
    <Link 
      href={href || "#"} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? "bg-[#1f2431] text-white border-l-4 border-yellow-500" 
          : "text-gray-400 hover:bg-[#161922] hover:text-white"
      }`}
    >
      {/* Icon placeholder */}
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}