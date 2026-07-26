"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-slate-800 py-14 mt-20 text-[#F7F3E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">

          {/* Brand Info — 2 colonnes sur 5 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo-fond-sombre.svg" alt="StartupSN Logo" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-medium">
              Propulser l&apos;écosystème technologique sénégalais vers de nouveaux sommets.
              Startups, investisseurs et partenaires : tout l&apos;écosystème, au même endroit.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  Annuaire
                </Link>
              </li>
              <li>
                <Link href="/investors" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  Pour les investisseurs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  Inscrire ma startup
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Ressources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/opportunities" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  Appels à projets
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  Guide de l&apos;entrepreneur
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  Modèles de documents
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-slate-300 hover:text-amber-400 transition-colors">
                  Incubateurs & Partenaires
                </Link>
              </li>
            </ul>
          </div>

          {/* Communauté */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Communauté
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://www.linkedin.com/company/startup221"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/startup221sn"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/startup221"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-300 hover:text-amber-400 transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-sm text-amber-400 hover:underline transition-colors font-bold">
                  Espace Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Bottom bar */}
        <div className="border-t border-slate-800 pt-7 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500 font-medium">
            © 2026 Startup221 — Fait avec{" "}
            <span className="text-amber-400">★</span>{" "}
            à Dakar
          </p>
          <p className="text-xs text-slate-500 font-mono tracking-widest uppercase">
            Registre de l&apos;Écosystème Tech · +221
          </p>
        </div>
      </div>
    </footer>
  );
}
