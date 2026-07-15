"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { API } from "../../lib/api";

// ─── Data ─────────────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    emoji: "🌐",
    title: "Connectez-vous",
    desc: "Accédez à l'annuaire des startups, investisseurs, incubateurs et institutions du Sénégal. Filtrez par secteur, stade ou pour trouver le bon partenaire.",
    color: "text-brand-active",
    bg: "bg-brand-50",
  },
  {
    emoji: "📈",
    title: "Gagnez en visibilité",
    desc: "Créez une fiche complète, mettez en avant vos besoins de financement, partenariats, recrutement et soyez visible de tout l'écosystème.",
    color: "text-brand-gold",
    bg: "bg-amber-50",
  },
  {
    emoji: "🤝",
    title: "Saisissez des opportunités",
    desc: "Participez aux programmes et concours des incubateurs partenaires. Accédez à des ressources gratuites : guides, modèles, formations.",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
];

const TARGETS_INFO = [
  {
    category: "Pensé pour les startups",
    subtitle: "Placez votre projet au cœur de l'action",
    bullets: [
      "Inscrivez votre startup gratuitement, en quelques minutes.",
      "Annoncez vos recherches : financement, partenaires, talents.",
      "Suivez qui consulte votre profil.",
      "Rejoignez la communauté des fondateurs du Sénégal et de la diaspora.",
    ],
    emoji: "🚀",
    color: "bg-brand-50 text-brand-active",
  },
  {
    category: "Pensé pour les investisseurs",
    subtitle: "Repérez les meilleures opportunités",
    bullets: [
      "Un flux qualifié de startups en recherche de fonds.",
      "Les tendances par secteur et par région.",
      "Un contact direct avec les fondateurs.",
      "Un profil visible des startups qui vous correspondent.",
    ],
    emoji: "💼",
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
    emoji: "🏢",
    color: "bg-emerald-50 text-emerald-700",
  },
];

const STATS = [
  { value: "+150", label: "Startups référencées", emoji: "🏢" },
  { value: "12 Mds", label: "FCFA levés via le réseau", emoji: "📈" },
  { value: "+50", label: "Investisseurs actifs", emoji: "🤝" },
  { value: "3", label: "Pays couverts", emoji: "🌍" },
];

const TESTIMONIALS = [
  {
    quote: "StartupSN m'a permis de trouver SenPay en 48h. Le deal-flow est exactement ce dont j'avais besoin pour l'Afrique de l'Ouest.",
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
    color: "bg-amber-50 text-brand-gold",
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
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-paper min-h-screen overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-paper overflow-hidden pt-12">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[500px] h-[500px] bg-brand-active/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-40px] left-[-60px] w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-brand-100 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-28 text-center relative z-10">
          <GradientBadge text="Accès anticipé ouvert — Places limitées" />

          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-[1.12] tracking-tight max-w-3xl mx-auto mb-6">
            Le point de rencontre de la <br />
            <span className="text-brand-active">Tech sénégalaise</span>
          </h1>

          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            StartupSN recense, connecte et valorise les startups les plus prometteuses du Sénégal. Un seul endroit pour découvrir l'écosystème, lever des fonds, recruter et nouer des partenariats.
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
                <span className="text-brand-active font-extrabold">&#10003;</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────────────── */}
      <section className="border-y border-slate-200/60 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          {STATS.map(({ value, label, emoji }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-6 py-2 text-center">
              <span className="text-2xl mb-1">{emoji}</span>
              <span className="text-3xl font-extrabold text-brand-dark">{value}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VALUE PROPS ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <GradientBadge text="Pourquoi StartupSN ?" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
            Une plateforme pensée pour
            <br />
            <span className="text-brand-active">tout l'écosystème</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {VALUE_PROPS.map(({ emoji, title, desc, color, bg }) => (
            <div
              key={title}
              className="bg-white border border-slate-100 rounded-2xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5`}>
                <span className="text-2xl">{emoji}</span>
              </div>
              <h3 className="text-lg font-extrabold text-brand-dark mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TARGETS INFO (À chacun son usage) ────────────────────────── */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <GradientBadge text="À chacun son usage" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
              Startups, investisseurs, partenaires :
              <br />
              <span className="text-brand-active">chacun y trouve son compte</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TARGETS_INFO.map(({ category, subtitle, bullets, emoji, color }) => (
              <div key={category} className="bg-brand-paper border border-slate-200/50 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{emoji}</span>
                    <h3 className="text-base font-extrabold text-brand-dark uppercase tracking-wider">{category}</h3>
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 mb-6">{subtitle}</h4>
                  <ul className="space-y-3">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                        <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
            Ce que disent nos investisseurs
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map(({ quote, name, role, initials, color }) => (
            <div
              key={name}
              className="bg-white border border-slate-100 rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300"
            >
              <div className="text-5xl font-black text-brand-100 leading-none mb-4 select-none">&ldquo;</div>
              <p className="text-slate-600 font-medium leading-relaxed mb-6 text-[15px]">{quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 ${color}`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-dark">{name}</p>
                  <p className="text-xs text-slate-400 font-medium">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA / LEAD CAPTURE ───────────────────────────────────────── */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden py-24 px-6 bg-brand-dark text-brand-paper"
      >
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            Accès anticipé · Places limitées
          </span>

          <h2 className="text-3xl md:text-[42px] font-extrabold text-white leading-tight tracking-tight mb-4">
            L'écosystème tech sénégalais vous attend
          </h2>

          <p className="text-white/70 text-base font-medium mb-10 leading-relaxed">
            Rejoignez la communauté qui façonne l'avenir de la Tech au Sénégal de Dakar à Ziguinchor, de Saint-Louis à la diaspora. Laissez votre email pour recevoir votre invitation d'accès prioritaire.
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
                    <>Envoi...</>
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
                <span className="text-brand-active font-extrabold">&#10003;</span>
                Confirmation envoyée à <strong className="text-white/70">{email}</strong>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
