"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-slate-800 py-16 mt-20 text-[#F7F3E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo-fond-sombre.svg" alt="StartupSN Logo" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed font-medium">
              Propulser l&apos;écosystème technologique sénégalais vers de nouveaux sommets. Startups, investisseurs et partenaires : tout l&apos;écosystème, au même endroit.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3 font-medium">
              <li>
                <Link href="/" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Annuaire
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/for-investors" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Investisseurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3 font-medium">
              <li>
                <span className="text-sm text-slate-500 cursor-default select-none">
                  Politique de confidentialité (bientôt)
                </span>
              </li>
              <li>
                <span className="text-sm text-slate-500 cursor-default select-none">
                  Contact (bientôt)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © 2026 StartupSN. Au cœur de la Tech sénégalaise.
          </p>
        </div>
      </div>
    </footer>
  );
}
