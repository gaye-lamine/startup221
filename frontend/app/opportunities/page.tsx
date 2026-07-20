"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import { Calendar, ExternalLink, Award, Sparkles, Filter } from "lucide-react";

interface Program {
  id: string;
  partner_name: string;
  title: string;
  category: string;
  description: string;
  deadline: string;
  apply_url: string;
  target_sectors: string[];
}

export default function OpportunitiesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      setLoading(true);
      try {
        const res = await fetch(API.partners.programs);
        if (res.ok) {
          const data = await res.json();
          setPrograms(data);
        }
      } catch (err) {
        console.error("Error fetching opportunity programs", err);
      } finally {
        setLoading(false);
      }
    }
    loadPrograms();
  }, []);

  return (
    <div className="bg-brand-paper min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-amber-50/50 via-white to-transparent pt-16 pb-12 text-center border-b border-slate-200/60 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 bg-amber-50 text-brand-gold text-xs font-bold px-3.5 py-1.5 rounded-full border border-amber-100">
            <Sparkles className="w-3.5 h-3.5" />
            Appels à Projets & Opportunités
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight">
            Concours, financements & programmes <br />
            <span className="text-brand-gold">pour propulser votre startup</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Ne manquez aucun appel à candidatures des incubateurs, fondations et institutions partenaires du Sénégal.
          </p>
        </div>
      </section>

      {/* Programs List */}
      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-6">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            Chargement des opportunités et programmes en cours...
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400">
            Aucun appel à projets répertorié actuellement.
          </div>
        ) : (
          programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-amber-100 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-amber-50 text-brand-gold border border-amber-100">
                    {prog.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Proposé par : <strong className="text-slate-700">{prog.partner_name}</strong>
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                  {prog.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {prog.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date limite : {prog.deadline}</span>
                  </div>

                  {prog.target_sectors && prog.target_sectors.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prog.target_sectors.map((sec) => (
                        <span key={sec} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {sec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Apply Action */}
              <a
                href={prog.apply_url.startsWith("http") ? prog.apply_url : `https://${prog.apply_url}`}
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
              >
                <span>Postuler maintenant</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
