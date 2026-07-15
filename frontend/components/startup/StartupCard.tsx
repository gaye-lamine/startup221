"use client";

import React from "react";
import Link from "next/link";

export interface Startup {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  sector: string;
  employee_count: number;
  description: string;
  seeking: string[];
}

interface StartupCardProps {
  startup: Startup;
}

export default function StartupCard({ startup }: StartupCardProps) {
  // Sector color selector
  const getSectorBadgeClass = (sector: string) => {
    const s = sector.toLowerCase();
    if (s.includes("fintech")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (s.includes("agritech")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    } else if (s.includes("healthtech")) {
      return "bg-sky-50 text-sky-700 border-sky-100";
    } else if (s.includes("edtech")) {
      return "bg-amber-50 text-amber-700 border-amber-100";
    } else if (s.includes("logistique")) {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }
    return "bg-slate-50 text-slate-700 border-slate-100";
  };

  // Human-readable seeking needs helper
  const getSeekingBadge = (need: string) => {
    const n = need.toLowerCase();
    if (n.includes("investiss")) {
      return { label: "Investisseurs", emoji: "🎯", class: "bg-rose-50 border-rose-100 text-rose-700" };
    } else if (n.includes("partenaire")) {
      return { label: "Partenaires", emoji: "🤝", class: "bg-teal-50 border-teal-100 text-teal-700" };
    } else if (n.includes("recrut")) {
      return { label: "Recrutement", emoji: "💼", class: "bg-violet-50 border-violet-100 text-violet-700" };
    }
    return { label: need, emoji: "💡", class: "bg-slate-50 border-slate-100 text-slate-700" };
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-[320px] w-full">
      <div>
        {/* Logo & Sector Badge */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 overflow-hidden">
            {startup.logo_url && startup.logo_url !== "#" ? (
              <img
                src={startup.logo_url}
                alt={`${startup.name} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-brand-active font-extrabold text-lg select-none">
                {startup.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getSectorBadgeClass(startup.sector)}`}>
            {startup.sector}
          </span>
        </div>

        {/* Title */}
        <Link href={`/startup/${startup.slug}`}>
          <h3 className="text-lg font-extrabold text-slate-900 hover:text-brand-active transition-colors truncate">
            {startup.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed font-medium">
          {startup.description}
        </p>
      </div>

      <div className="space-y-4 mt-4">
        {/* Metadata Line */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-bold bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-lg">
            <span>👥</span>
            <span>{startup.employee_count} collaborateurs</span>
          </div>

          {/* Goal tags */}
          {startup.seeking.map((need, index) => {
            const badge = getSeekingBadge(need);
            return (
              <span
                key={index}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${badge.class}`}
              >
                <span>{badge.emoji}</span>
                <span>{badge.label}</span>
              </span>
            );
          })}
        </div>

        {/* CTA Button */}
        <Link href={`/startup/${startup.slug}`} className="block w-full">
          <button className="w-full bg-brand-light hover:bg-brand-active hover:text-white text-brand-active font-bold py-2.5 rounded-xl text-sm transition-all duration-200">
            Voir le profil
          </button>
        </Link>
      </div>
    </div>
  );
}
