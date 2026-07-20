"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import { FileText, Download, BookOpen, ShieldCheck } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  file_type: string;
  file_url: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResources() {
      setLoading(true);
      try {
        const res = await fetch(API.partners.resources);
        if (res.ok) {
          const data = await res.json();
          setResources(data);
        }
      } catch (err) {
        console.error("Error fetching resources", err);
      } finally {
        setLoading(false);
      }
    }
    loadResources();
  }, []);

  return (
    <div className="bg-brand-paper min-h-screen pb-24">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-brand-50/50 via-white to-transparent pt-16 pb-12 text-center border-b border-slate-200/60 px-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-active text-xs font-bold px-3.5 py-1.5 rounded-full border border-brand-100">
            <BookOpen className="w-3.5 h-3.5" />
            Ressources & Guides Gratuits
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-brand-dark tracking-tight leading-tight">
            Modèles de documents, guides juridiques <br />
            <span className="text-brand-active">& Startup Act Sénégal</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Téléchargez gratuitement des modèles de Pitch Deck, pactes d&apos;actionnaires conformes aux règles OHADA et les guides de labellisation.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <div className="max-w-6xl mx-auto px-6 pt-12">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-medium">
            Chargement de la bibliothèque de ressources...
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400">
            Aucune ressource disponible actuellement.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-brand-100 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-active">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {res.file_type}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-brand-active uppercase tracking-wider block mb-1">
                      {res.category}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {res.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <a
                  href={res.file_url.startsWith("http") ? res.file_url : `https://${res.file_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-50 hover:bg-brand-50 text-slate-800 hover:text-brand-active border border-slate-200 hover:border-brand-100 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger la ressource</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
