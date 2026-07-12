import React from "react";

import { Globe, Send } from "lucide-react"; // Kept only for social links — no visual icons

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="text-xl font-bold text-brand-active">Startup221</span>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Propulser l'écosystème technologique sénégalais vers de nouveaux sommets.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg">
                LinkedIn
              </a>
              <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors border border-slate-200 px-3 py-1.5 rounded-lg">
                Twitter
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Directory
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/for-investors" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  For Investors
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Communauté
            </h3>
            <div className="flex gap-2">
              <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                Website
              </a>
              <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © 2026 Startup221. Fueling the Senegalese Tech Ecosystem.
          </p>
        </div>
      </div>
    </footer>
  );
}
