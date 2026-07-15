"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Edit Profile", href: "/dashboard/profile" },
  { label: "Messages", href: "/dashboard/messages", badge: 3 },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F7F3E8] flex">
      {/* ─── Fixed Sidebar ─────────────────────────────────────────── */}
      <aside className="w-[200px] shrink-0 bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 h-full z-40 shadow-[2px_0_16px_rgba(0,0,0,0.02)]">
        {/* Brand */}
        <div className="px-5 pt-6 pb-5">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <img src="/logo-principal.svg" alt="StartupSN Logo" className="h-6 w-auto" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 px-3 pb-4 flex-grow">
          {NAV_ITEMS.map(({ label, href, badge }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-active"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span>{label}</span>
                {badge && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="px-3 pb-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            &larr; Retour au site
          </Link>
        </div>

        {/* User info */}
        <div className="border-t border-slate-100 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-active flex items-center justify-center text-white font-bold text-sm shrink-0">
            SP
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate leading-tight">
              Équipe SenPay
            </p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
              Admin de la Plateforme
            </p>
          </div>
        </div>
      </aside>

      {/* ─── Main content ──────────────────────────────────────────── */}
      <main className="flex-grow ml-[200px] min-h-screen">{children}</main>
    </div>
  );
}
