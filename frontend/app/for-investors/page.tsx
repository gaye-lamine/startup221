"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";

const VALUE_PROPS = [
  {
    category: "Pensé pour les startups",
    subtitle: "Développez votre visibilité et trouvez vos partenaires",
    bullets: [
      "Un profil complet avec vos métriques clés, votre équipe et vos besoins.",
      "Soyez visible des investisseurs et partenaires en recherche active.",
      "Recevez des demandes de contact qualifiées directement de l'écosystème.",
      "Consultez les tendances du marché pour affiner votre positionnement.",
    ],
    color: "bg-brand-50 text-brand-active",
  },
  {
    category: "Pensé pour les investisseurs",
    subtitle: "Accédez à un flux qualifié de startups au Sénégal",
    bullets: [
      "Un annuaire public complet des startups en recherche de fonds.",
      "Des filtres précis par secteur, taille d'équipe et ville.",
      "Prise de contact directe et sans intermédiaire avec les fondateurs.",
      "L'accès complet aux fiches détaillées des startups.",
    ],
    color: "bg-amber-50 text-brand-gold",
  },
  {
    category: "Pensé pour les partenaires",
    subtitle: "Identifiez l'innovation qui transformera votre secteur",
    bullets: [
      "Repérez les innovations émergentes par filière.",
      "Diffusez vos appels à projets et programmes.",
      "Valorisez votre engagement pour l'innovation locale.",
    ],
    color: "bg-emerald-50 text-emerald-700",
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function GradientBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-active text-xs font-bold px-3 py-1.5 rounded-full border border-brand-100 mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-active animate-pulse" />
      {text}
    </span>
  );
}

export default function ForInvestorsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trends, setTrends] = useState<{
    total_startups: number;
    sectors_count: number;
    cities_count: number;
  }>({
    total_startups: 0,
    sectors_count: 0,
    cities_count: 0,
  });

  useEffect(() => {
    async function loadTrends() {
      try {
        const res = await fetch(API.startups.trends);
        if (res.ok) {
          const data = await res.json();
          setTrends({
            total_startups: data.total_startups || 0,
            sectors_count: data.by_sector?.length || 0,
            cities_count: data.by_city?.length || 0,
          });
        }
      } catch (err) {
        console.error("Trends fetch error", err);
      }
    }
    loadTrends();
  }, []);

  const scrollToCTA = () => {
    document.getElementById("investor-form-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API.investors.subscribe, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError(data.detail);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Erreur serveur");

      setSubmitted(true);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-paper min-h-screen overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-paper overflow-hidden pt-12">
        <div className="max-w-6xl mx-auto px-6 py-28 text-center relative z-10">
          <GradientBadge text="Accès libre et gratuit pour tous" />

          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-[1.12] tracking-tight max-w-3xl mx-auto mb-6">
            Trouvez votre prochaine <br />
            <span className="text-brand-active">opportunité d&apos;investissement</span>
          </h1>

          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            StartupSN est un répertoire 100% public et gratuit. Aucun compte n&apos;est requis pour les investisseurs : explorez l&apos;annuaire, filtrez par secteur, et contactez directement les fondateurs par e-mail en un clic.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 bg-brand-active hover:bg-brand-600 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-brand-active/20 text-sm"
            >
              Explorer l&apos;annuaire de startups &rarr;
            </Link>
            <button
              onClick={scrollToCTA}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-4 rounded-xl border border-slate-200 transition-all text-sm"
            >
              S&apos;abonner aux alertes mail &rsaquo;
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {["Données publiques", "Mise en relation directe", "Pas d'inscription requise"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="text-brand-active font-extrabold">&#10003;</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Stats Banner */}
      <section className="border-y border-slate-200/60 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center gap-4 sm:gap-0">
          <div className="flex flex-col items-center gap-1 px-6 py-2">
            <span className="text-3xl font-extrabold text-brand-dark">
              {trends.total_startups}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Startups Référencées
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 px-6 py-2">
            <span className="text-3xl font-extrabold text-brand-active">
              {trends.sectors_count}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Secteurs d&apos;Activité
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 px-6 py-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {trends.cities_count}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Villes Couvertes
            </span>
          </div>
        </div>
      </section>

      {/* ─── VALUE PROPOSITIONS ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-brand-active bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Une plateforme pour tout l&apos;écosystème
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Pourquoi utiliser StartupSN ?
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Startups, investisseurs, partenaires : chacun y trouve son compte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUE_PROPS.map((vp) => (
            <div
              key={vp.category}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${vp.color}`}>
                  {vp.category}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                  {vp.subtitle}
                </h3>
                <ul className="space-y-2.5 pt-2">
                  {vp.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                      <span className="text-brand-active font-extrabold text-sm leading-none">&bull;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-active hover:underline pt-2"
              >
                Explorer l&apos;annuaire &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER SUBSCRIPTION FORM ──────────────────────────────── */}
      <section id="investor-form-section" className="bg-brand-dark text-white py-20 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
              Alertes Mensuelles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Recevez les nouvelles pépites directement par e-mail
            </h2>
            <p className="text-sm text-white/70 font-medium max-w-xl mx-auto leading-relaxed">
              Inscrivez-vous pour recevoir notre synthèse mensuelle des nouvelles startups référencées et des opportunités d&apos;investissement.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto">
              <span className="text-2xl">✓</span>
              <p className="text-base font-extrabold text-white">
                Vous êtes bien inscrit aux alertes Deal-Flow !
              </p>
              <p className="text-xs text-white/70 font-medium">
                Vous recevrez prochainement nos synthèses directement dans votre boîte e-mail.
              </p>
              <Link
                href="/"
                className="inline-block bg-white text-brand-dark font-bold text-xs px-6 py-3 rounded-xl mt-2 hover:bg-slate-100 transition-all"
              >
                Accéder à l&apos;annuaire public &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="votre.email@fonds.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3.5 rounded-xl text-xs outline-none focus:border-white focus:bg-white/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md shrink-0 disabled:opacity-70"
                >
                  {loading ? "Inscription..." : "S'abonner"}
                </button>
              </div>

              {error && (
                <p className="text-xs text-amber-300 font-bold bg-amber-950/40 p-3 rounded-xl border border-amber-500/30">
                  {error}
                </p>
              )}

              <p className="text-[11px] text-white/50">
                Pas de spam. Désabonnement en un clic. Vos données sont protégées.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
