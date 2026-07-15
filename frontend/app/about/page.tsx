"use client";

import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-brand-paper min-h-screen pb-20">
      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-transparent pt-24 pb-16 text-center border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E6F4EA] border border-[#CEEAD6] text-brand-active text-xs font-bold px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-active animate-pulse" />
            startups.sn
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-dark leading-[1.12] tracking-tight max-w-3xl mx-auto mb-6">
            Le point de rencontre de la <br />
            <span className="text-brand-active">Tech sénégalaise</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            StartupSN recense, connecte et valorise les startups les plus prometteuses du Sénégal. Un seul endroit pour découvrir l'écosystème, lever des fonds, recruter et nouer des partenariats.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto bg-brand-active hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-brand-active/20 text-sm text-center"
            >
              Explorer l'annuaire &rarr;
            </Link>
            <Link
              href="/for-investors"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-xl border border-slate-200 transition-all text-sm text-center"
            >
              Accès Investisseurs &rsaquo;
            </LinkNext>
          </div>
        </div>
      </section>

      {/* ─── POURQUOI STARTUPSN ? ────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-brand-active uppercase tracking-widest bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
            Pourquoi StartupSN ?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mt-6">
            Une plateforme pensée pour tout l'écosystème
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              🌐
            </div>
            <h3 className="text-xl font-extrabold text-brand-dark mb-3">Connectez-vous</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Accédez à l'annuaire des startups, investisseurs, incubateurs et institutions du Sénégal. Filtrez par secteur, stade ou pour trouver le bon partenaire.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              📈
            </div>
            <h3 className="text-xl font-extrabold text-brand-dark mb-3">Gagnez en visibilité</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Créez une fiche complète, mettez en avant vos besoins de financement, partenariats, recrutement et soyez visible de tout l'écosystème.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-2xl">
              🤝
            </div>
            <h3 className="text-xl font-extrabold text-brand-dark mb-3">Saisissez des opportunités</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Participez aux programmes et concours des incubateurs partenaires. Accédez à des ressources gratuites : guides, modèles, formations.
            </p>
          </div>
        </div>
      </section>

      {/* ─── A CHACUN SON USAGE ───────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-200/60 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-brand-active uppercase tracking-widest bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
              À chacun son usage
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight mt-6">
              Startups, investisseurs, partenaires : <br />
              <span className="text-brand-active">chacun y trouve son compte</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Startups */}
            <div className="bg-brand-paper border border-slate-200/50 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🚀</span>
                  <h3 className="text-lg font-extrabold text-brand-dark uppercase tracking-wider">Pensé pour les startups</h3>
                </div>
                <h4 className="text-sm font-bold text-slate-700 mb-6">Placez votre projet au cœur de l'action</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Inscrivez votre startup gratuitement, en quelques minutes.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Annoncez vos recherches : financement, partenaires, talents.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Suivez qui consulte votre profil.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Rejoignez la communauté des fondateurs du Sénégal et de la diaspora.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Investisseurs */}
            <div className="bg-brand-paper border border-slate-200/50 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">💼</span>
                  <h3 className="text-lg font-extrabold text-brand-dark uppercase tracking-wider">Pensé pour les investisseurs</h3>
                </div>
                <h4 className="text-sm font-bold text-slate-700 mb-6">Repérez les meilleures opportunités</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Un flux qualifié de startups en recherche de fonds.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Les tendances par secteur et par région.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Un contact direct avec les fondateurs.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Un profil visible des startups qui vous correspondent.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Partenaires */}
            <div className="bg-brand-paper border border-slate-200/50 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🏢</span>
                  <h3 className="text-lg font-extrabold text-brand-dark uppercase tracking-wider">Pensé pour les partenaires</h3>
                </div>
                <h4 className="text-sm font-bold text-slate-700 mb-6">Identifiez l'innovation qui transformera votre secteur</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Repérez les innovations émergentes par filière.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Diffusez vos appels à projets et programmes.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <span className="text-brand-active font-extrabold mt-0.5">&bull;</span>
                    <span>Valorisez votre engagement pour l'innovation locale.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-6 bg-brand-dark text-brand-paper text-center">
        <div className="absolute top-[-65px] right-[-65px] w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-45px] left-[-45px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/90 text-xs font-bold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            L'écosystème tech sénégalais vous attend
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Rejoignez la communauté qui façonne l'avenir <br />
            de la Tech au Sénégal
          </h2>

          <p className="text-white/70 text-base max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            De Dakar à Ziguinchor, de Saint-Louis à la diaspora, connectez-vous avec les talents, investisseurs et partenaires du Sénégal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-brand-gold hover:bg-yellow-500 text-brand-dark font-bold px-8 py-4 rounded-xl transition-all shadow-md text-sm text-center"
            >
              Inscrire ma Startup &rarr;
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl border border-white/20 transition-all text-sm text-center"
            >
              Parcourir l'annuaire &rsaquo;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
