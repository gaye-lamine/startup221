"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import { Globe, Linkedin, Building, Award, ArrowUpRight } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  slug: string;
  email: string;
  partner_type: string;
  logo_url: string;
  description: string;
  city: string;
  website_url: string;
  linkedin_url: string;
}

export default function PartnersDirectoryPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    async function loadPartners() {
      setLoading(true);
      try {
        const url = filterType !== "all" 
          ? `${API.partners.list}?partner_type=${encodeURIComponent(filterType)}`
          : API.partners.list;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setPartners(data);
        }
      } catch (err) {
        console.error("Error fetching partners directory", err);
      } finally {
        setLoading(false);
      }
    }
    loadPartners();
  }, [filterType]);

  return (
    <div className="bg-brand-paper min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-emerald-50/50 via-white to-transparent pt-16 pb-12 text-center border-b border-slate-200/60 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Partenaires & Incubateurs
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight">
            Les incubateurs & institutions qui accompagnent <br />
            <span className="text-emerald-700">les entrepreneurs du Sénégal</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Retrouvez les structures d&apos;accompagnement, accélérateurs et institutions d&apos;appui au développement des startups.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: "all", label: "Tous les partenaires" },
              { id: "Incubateur", label: "Incubateurs" },
              { id: "Accélérateur", label: "Accélérateurs" },
              { id: "Institution", label: "Institutions" },
              { id: "Hub Tech", label: "Hubs Tech & Coworking" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all border ${
                  filterType === f.id
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
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
            Chargement des partenaires...
          </div>
        ) : partners.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400">
            Aucun partenaire trouvé sous cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-emerald-100 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                      {p.logo_url ? (
                        <img src={p.logo_url} alt={p.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building className="w-6 h-6 text-emerald-600" />
                      )}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {p.partner_type}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {p.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                      {p.city} &bull; Sénégal
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
                  {p.website_url && (
                    <a
                      href={p.website_url.startsWith("http") ? p.website_url : `https://${p.website_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-emerald-700 transition-colors"
                    >
                      <span>Découvrir</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {p.linkedin_url && (
                    <a
                      href={p.linkedin_url.startsWith("http") ? p.linkedin_url : `https://${p.linkedin_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline ml-auto"
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
