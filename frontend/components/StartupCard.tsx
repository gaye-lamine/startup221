import React from "react";
import Link from "next/link";
import { Users, Coins, HelpCircle } from "lucide-react";

export interface Startup {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  sector: string;
  employee_count: number;
  description: string;
  seeking: string[];
  created_at: string;
}

interface StartupCardProps {
  startup: Startup;
}

export default function StartupCard({ startup }: StartupCardProps) {
  // Helper to resolve Tailwind classes based on Sector
  const getSectorStyle = (sector: string) => {
    switch (sector.toLowerCase()) {
      case "fintech":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100";
      case "healthtech":
        return "bg-sky-50 text-sky-600 border border-sky-100";
      case "agritech":
        return "bg-indigo-50 text-indigo-600 border border-indigo-100";
      case "edtech":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      case "logistique":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      default:
        return "bg-slate-50 text-slate-600 border border-slate-100";
    }
  };

  // Helper to resolve Seeking styles (mockup-like color combinations)
  const getSeekingBadge = (need: string) => {
    const needLower = need.toLowerCase();
    if (needLower.includes("investiss")) {
      return {
        bg: "bg-rose-50 border-rose-100 text-rose-600",
        icon: "🎯",
      };
    } else if (needLower.includes("partenaire")) {
      return {
        bg: "bg-emerald-50 border-emerald-100 text-emerald-600",
        icon: "🤝",
      };
    } else if (needLower.includes("série") || needLower.includes("serie")) {
      return {
        bg: "bg-purple-50 border-purple-100 text-purple-600",
        icon: "🚀",
      };
    } else if (needLower.includes("recrut")) {
      return {
        bg: "bg-blue-50 border-blue-100 text-blue-600",
        icon: "💼",
      };
    }
    return {
      bg: "bg-slate-50 border-slate-100 text-slate-600",
      icon: "💡",
    };
  };

  // Team size display helper
  const getEmployeeRange = (count: number) => {
    if (count <= 10) return "1-10 employés";
    if (count <= 50) return "11-50 employés";
    return "50+ employés";
  };

  // Handle logo fallback (showing initial of the startup)
  const renderLogo = () => {
    if (startup.logo_url && startup.logo_url !== "#" && startup.logo_url.startsWith("http")) {
      return (
        <img
          src={startup.logo_url}
          alt={`${startup.name} logo`}
          className="w-12 h-12 object-contain"
        />
      );
    }
    
    // Fallback stylish avatar
    const initials = startup.name.slice(0, 2).toUpperCase();
    return (
      <div className="w-12 h-12 rounded-lg bg-brand-50 flex items-center justify-center font-bold text-brand-active text-lg">
        {initials}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 flex flex-col justify-between h-[300px]">
      <div>
        {/* Top Header Row: Logo & Sector Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="p-1 border border-slate-100 rounded-lg bg-slate-50">
            {renderLogo()}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getSectorStyle(startup.sector)}`}>
            {startup.sector}
          </span>
        </div>

        {/* Title & Description */}
        <Link href={`/startup/${startup.slug}`}>
          <h3 className="text-lg font-bold text-slate-800 hover:text-brand-active cursor-pointer transition-colors line-clamp-1">
            {startup.name}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 mt-2 mb-4 line-clamp-2 leading-relaxed">
          {startup.description}
        </p>
      </div>

      {/* Metadata & Actions */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Employee Count */}
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{getEmployeeRange(startup.employee_count)}</span>
          </div>

          {/* Needs Badges */}
          {startup.seeking.map((need, idx) => {
            const badge = getSeekingBadge(need);
            return (
              <div
                key={idx}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold ${badge.bg}`}
              >
                <span>{badge.icon}</span>
                <span>{need}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <Link href={`/startup/${startup.slug}`} className="block w-full">
          <button className="w-full bg-[#E1E6FF] text-brand-active hover:bg-brand-200 font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200">
            Voir le profil
          </button>
        </Link>
      </div>
    </div>
  );
}
