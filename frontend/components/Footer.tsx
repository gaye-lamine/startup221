"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-slate-800 py-16 mt-20 text-[#F7F3E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo-fond-sombre.svg" alt="StartupSN Logo" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed font-medium">
              Propulser l'écosystème technologique sénégalais vers de nouveaux sommets. Startups, investisseurs et partenaires : tout l'écosystème, au même endroit.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded-lg bg-white/5">
                LinkedIn
              </a>
              <a href="#" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors border border-slate-700 px-3 py-1.5 rounded-lg bg-white/5">
                Twitter
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3 font-medium">
              <li>
                <a href="/" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Directory
                </a>
              </li>
              <li>
                <button 
                  onClick={() => alert("À propos : StartupSN connecte l'écosystème tech sénégalais avec les investisseurs mondiaux.")}
                  className="text-sm text-slate-300 hover:text-white transition-colors text-left"
                >
                  About
                </button>
              </li>
              <li>
                <a href="/for-investors" className="text-sm text-slate-300 hover:text-white transition-colors">
                  For Investors
                </a>
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
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Communauté
            </h3>
            <div className="flex gap-2 font-medium">
              <a href="#" className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors bg-white/5">
                Website
              </a>
              <a href="#" className="text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors bg-white/5">
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © 2026 StartupSN. Fueling the Senegalese Tech Ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
