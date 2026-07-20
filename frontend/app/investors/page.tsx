"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import { Globe, Linkedin, ShieldCheck, Tag, Building2 } from "lucide-react";

interface Investor {
  id: string;
  name: string;
  slug: string;
  email: string;
  entity_type: string;
  logo_url: string;
  bio: string;
  investment_stages: string[];
  sectors: string[];
  ticket_size: string;
  city: string;
  website_url: string;
  linkedin_url: string;
}

export default function InvestorsDirectoryPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    async function loadInvestors() {
      setLoading(true);
      try {
        const url = filterType !== "all" 
          ? `${API.investors.directory}?entity_type=${encodeURIComponent(filterType)}`
          : API.investors.directory;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setInvestors(data);
        }
      } catch (err) {
        console.error("Error fetching investors directory", err);
      } finally {
        setLoading(false);
      }
    }
    loadInvestors();
  }, [filterType]);

  return (
    <div className="bg-brand-paper min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-brand-50/50 via-white to-transparent pt-16 pb-12 text-center border-b border-slate-200/60 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-active text-xs font-bold px-3.5 py-1.5 rounded-full border border-brand-100">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-active animate-pulse" />
            Répertoire des Investisseurs
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight">
            Les fonds & investisseurs qui financent <br />
            <span className="text-brand-active">la Tech au Sénégal</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Découvrez les Business Angels, fonds de Venture Capital et Family Offices actifs dans la sous-région et leurs thèses d&apos;investissement.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: "all", label: "Tous les investisseurs" },
              { id: "VC / Fonds", label: "Fonds de VC" },
              { id: "Business Angel", label: "Business Angels" },
              { id: "Family Office", label: "Family Offices" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                  filterType === f.id
                    ? "bg-brand-active text-white border-brand-active shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            Chargement de l&apos;annuaire des investisseurs...
          </div>
        ) : investors.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400">
            Aucun investisseur ne correspond à ce filtre pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((inv) => (
              <div
                key={inv.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-brand-100 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                      {inv.logo_url ? (
                        <img src={inv.logo_url} alt={inv.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building2 className="w-6 h-6 text-brand-active" />
                      )}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-amber-50 text-brand-gold border border-amber-100">
                      {inv.entity_type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                      {inv.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {inv.city} &bull; Ticket: <strong className="text-brand-active">{inv.ticket_size}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                    {inv.bio}
                  </p>

                  {/* Stages & Sectors Tags */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {inv.investment_stages.map((st) => (
                        <span key={st} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {st}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {inv.sectors.map((sec) => (
                        <span key={sec} className="text-[10px] font-bold bg-brand-50 text-brand-active px-2 py-0.5 rounded">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* External links */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                  {inv.website_url && (
                    <a
                      href={inv.website_url.startsWith("http") ? inv.website_url : `https://${inv.website_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-brand-active transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span>Site officiel</span>
                    </a>
                  )}
                  {inv.linkedin_url && (
                    <a
                      href={inv.linkedin_url.startsWith("http") ? inv.linkedin_url : `https://${inv.linkedin_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-brand-active hover:underline ml-auto"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
