"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { API } from "../../lib/api";

const NAV_ITEMS = [
  {
    label: "Vue d'ensemble",
    href: "/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "Modifier le profil",
    href: "/dashboard/profile",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    isMessages: true,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [startupName, setStartupName] = useState("Ma Startup");
  const [initials, setInitials] = useState("ST");
  const [unrepliedCount, setUnrepliedCount] = useState<number>(0);

  useEffect(() => {
    const storedName = localStorage.getItem("startup_name");
    const storedSlug = localStorage.getItem("startup_slug");
    const token = localStorage.getItem("startup_token");

    if (storedName) {
      setStartupName(storedName);
      const parts = storedName.trim().split(/\s+/);
      const computed = parts.map((p) => p[0]).join("").slice(0, 2).toUpperCase();
      setInitials(computed || "ST");
    }

    if (storedSlug) {
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      fetch(API.dashboard.leads(storedSlug), { headers })
        .then((res) => (res.ok ? res.json() : []))
        .then((leads: any[]) => {
          if (Array.isArray(leads)) {
            const unreplied = leads.filter((l) => !l.replied).length;
            setUnrepliedCount(unreplied);
          }
        })
        .catch(() => setUnrepliedCount(0));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3E8] flex">
      {/* ─── Fixed Sidebar ─────────────────────────────────────────── */}
      <aside className="w-[240px] shrink-0 bg-white border-r border-slate-200 flex flex-col fixed top-0 left-0 h-full z-40 shadow-[2px_0_16px_rgba(0,0,0,0.02)]">
        {/* Brand */}
        <div className="px-6 pt-6 pb-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-principal.svg" alt="StartupSN Logo" className="h-6 w-auto" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-grow">
          {NAV_ITEMS.map(({ label, href, isMessages, icon }) => {
            const isActive = pathname === href;
            const showBadge = isMessages && unrepliedCount > 0;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-brand-active text-white shadow-md shadow-brand-active/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-slate-400"}>{icon}</span>
                  <span>{label}</span>
                </div>
                {showBadge && (
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      isActive ? "bg-white text-brand-active" : "bg-red-500 text-white"
                    }`}
                  >
                    {unrepliedCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to site */}
        <div className="px-4 pb-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            &larr; Retour au site
          </Link>
        </div>

        {/* User info */}
        <div className="border-t border-slate-100 p-5 flex items-center gap-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-brand-active flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm shadow-brand-active/20">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate leading-tight">
              {startupName}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-tight mt-1">
              Fondateur
            </p>
          </div>
        </div>
      </aside>

      {/* ─── Main content ──────────────────────────────────────────── */}
      <main className="flex-grow ml-[240px] min-h-screen">{children}</main>
    </div>
  );
}
