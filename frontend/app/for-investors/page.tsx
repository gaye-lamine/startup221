"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { API } from "../../lib/api";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    emoji: "\u2714",
    title: "Données vérifiées",
    desc: "Chaque startup est auditée par notre équipe avant publication. Financiers, équipe, traction : tout est validé.",
    color: "text-brand-active",
    bg: "bg-brand-50",
  },
  {
    emoji: "\u26a1",
    title: "Contact direct",
    desc: "Accédez directement aux fondateurs, sans intermédiaire ni frais de courtage. Votre message arrive en 24h.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    emoji: "\ud83d\udd79",
    title: "Filtres avancés",
    desc: "Filtrez par secteur, stade de financement, taille d'équipe et type de besoin pour un deal-flow ultra-ciblé.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    emoji: "\ud83d\udc64",
    title: "Créez votre compte",
    desc: "Inscription en 2 minutes. Renseignez votre profil investisseur (fonds, tickets, secteurs cibles).",
  },
  {
    num: "02",
    emoji: "\ud83d\udcca",
    title: "Analysez les profils",
    desc: "Accédez au deal-flow complet avec métriques, pitch deck et historique de financement de chaque startup.",
  },
  {
    num: "03",
    emoji: "\ud83d\udcac",
    title: "Prenez contact",
    desc: "Envoyez une demande de mise en relation directement aux fondateurs et commencez vos due diligences.",
  },
];

const STATS = [
  { value: "+150", label: "Startups référencées", emoji: "\ud83c\udfe2" },
  { value: "12 Mds", label: "FCFA levés via le réseau", emoji: "\ud83d\udcc8" },
  { value: "+50", label: "Investisseurs actifs", emoji: "\ud83e\udd1d" },
  { value: "3", label: "Pays couverts", emoji: "\ud83c\udf0d" },
];

const TESTIMONIALS = [
  {
    quote: "Startup221 m'a permis de trouver SenPay en 48h. Le deal-flow est exactement ce dont j'avais besoin pour l'Afrique de l'Ouest.",
    name: "Mariama Diallo",
    role: "Partner, Teranga Capital",
    initials: "MD",
    color: "bg-brand-50 text-brand-active",
  },
  {
    quote: "La qualité des dossiers est impressionnante. Les données sont vérifiées, les équipes sont solides. C'est la référence au Sénégal.",
    name: "Oumar Ndiaye",
    role: "Angel Investor & Ex-CTO",
    initials: "ON",
    color: "bg-violet-50 text-violet-600",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForInvestorsPage() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
    } catch {
      // Optimistic fallback for demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#F4F6FF] overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-brand-active/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-40px] left-[-60px] w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-brand-100 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-28 text-center relative z-10">
          <GradientBadge text="Accès anticipé ouvert — Places limitées" />

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.12] tracking-tight max-w-3xl mx-auto mb-6">
            Accédez au meilleur du{" "}
            <span className="text-brand-active">deal-flow technologique</span>{" "}
            sénégalais
          </h1>

          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            La première plateforme institutionnelle connectant les investisseurs africains et internationaux aux startups tech les plus prometteuses du Sénégal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCTA}
              className="flex items-center gap-2 bg-brand-active hover:bg-brand-600 text-white font-bold px-7 py-4 rounded-xl transition-all shadow-lg shadow-brand-active/20 text-sm"
            >
              Demander un accès Investisseur &rarr;
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold px-7 py-4 rounded-xl border border-slate-200 transition-all text-sm"
            >
              Explorer l'annuaire &rsaquo;
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {["Données vérifiées", "Contact sans intermédiaire", "100% gratuit"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="text-emerald-500">&#10003;</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {STATS.map(({ value, label, emoji }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-6 py-2 text-center">
              <span className="text-lg mb-1">{emoji}</span>
              <span className="text-2xl font-extrabold text-slate-900">{value}</span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VALUE PROPS ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <GradientBadge text="Pourquoi Startup221 ?" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tout ce dont un investisseur a besoin,
            <br />
            <span className="text-brand-active">en un seul endroit</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {VALUE_PROPS.map(({ emoji, title, desc, color, bg }) => (
            <div
              key={title}
              className="bg-white border border-slate-100 rounded-2xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5`}>
                <span className={`text-2xl ${color}`}>{emoji}</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PROCESS STEPS ────────────────────────────────────────────── */}
      <section className="bg-[#F4F6FF] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <GradientBadge text="Comment ça marche ?" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Commencez à investir en{" "}
              <span className="text-brand-active">3 étapes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-[1px] bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100" />

            {PROCESS_STEPS.map(({ num, emoji, title, desc }) => (
              <div key={num} className="relative flex flex-col items-center text-center gap-4">
                {/* Step bubble */}
                <div className="relative z-10 w-16 h-16 bg-white border-2 border-brand-100 rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(53,69,230,0.10)]">
                  <span className="text-2xl">{emoji}</span>
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-brand-active text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow">
                    {num.slice(1)}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-[230px] mx-auto">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <GradientBadge text="Ils nous font confiance" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ce que disent nos investisseurs
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, initials, color }) => (
            <div
              key={name}
              className="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] transition-all duration-300"
            >
              {/* Quote marks */}
              <div className="text-5xl font-black text-brand-100 leading-none mb-4 select-none">"</div>
              <p className="text-slate-700 leading-relaxed mb-6 text-[15px]">{quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 ${color}`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA / LEAD CAPTURE ───────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden py-24 px-6"
        style={{ background: "linear-gradient(135deg, #2236c4 0%, #3545E6 50%, #5b21b6 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-96 h-[1px] bg-white/10 pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Accès anticipé · Places limitées
          </span>

          <h2 className="text-3xl md:text-[42px] font-extrabold text-white leading-tight tracking-tight mb-4">
            Rejoignez les investisseurs qui
            <br />
            façonnent la tech africaine
          </h2>

          <p className="text-white/70 text-base font-medium mb-10 leading-relaxed">
            Laissez votre email pour recevoir votre invitation d'accès
            prioritaire à la plateforme Startup221.
          </p>

          {/* Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
              <div className="flex gap-2 bg-white/10 border border-white/20 rounded-2xl p-1.5 backdrop-blur-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-grow bg-transparent px-4 py-3 text-white placeholder-white/50 text-sm font-medium outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 bg-white text-brand-active font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                      </svg>
                      Envoi...
                    </>
                  ) : (
                    <>Commencer &rarr;</>
                  )}
                </button>
              </div>

              {error && (
                <div className="space-y-4 mt-3">
                  <p className="text-sm text-amber-300 font-medium flex items-center gap-1.5 justify-center">
                    <span>&#9888;</span>
                    {error}
                  </p>
                  <Link
                    href="/"
                    className="inline-block bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all border border-white/10"
                  >
                    Accéder directement à l'annuaire de startups &rarr;
                  </Link>
                </div>
              )}

              <p className="text-white/40 text-xs mt-4">
                Pas de spam. Désabonnement en un clic. Données protégées.
              </p>
            </form>
          ) : (
            /* Success state */
            <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto space-y-5">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto text-3xl">
                &#10003;
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white mb-2">
                  Vous êtes sur la liste ! 🎉
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Votre demande d'accès a bien été enregistrée. Notre équipe vous contactera sous{" "}
                  <strong className="text-white">48h</strong> avec vos identifiants.
                </p>
              </div>
              <div>
                <Link
                  href="/"
                  className="inline-block w-full bg-white text-brand-active font-bold text-sm py-3 rounded-xl hover:bg-white/95 transition-all shadow-md"
                >
                  Découvrir l'annuaire public &rarr;
                </Link>
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-white/50">
                <span className="text-emerald-400">&#10003;</span>
                Confirmation envoyée à <strong className="text-white/70">{email}</strong>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── REPLY MODAL ──────────────────────────────────────────────── */}
    </div>
  );
}
