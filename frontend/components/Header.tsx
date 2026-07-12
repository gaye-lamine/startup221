"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowLoginModal(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold text-brand-active tracking-tight flex items-center gap-1">
            <span>Startup221</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 h-16">
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1"
            >
              Directory
            </Link>
            <button
              onClick={() => alert("À propos : Startup221 connecte l'écosystème tech sénégalais avec les investisseurs mondiaux.")}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1"
            >
              About
            </button>
            <Link
              href="/for-investors"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1"
            >
              For Investors
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Login
          </button>
          <Link
            href="/register"
            className="text-sm font-medium bg-brand-active text-white px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
          >
            Signup
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden p-6 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Espace Fondateur</h3>
            <p className="text-xs text-slate-400 mb-6">
              Connectez-vous pour gérer votre profil et répondre aux investisseurs.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Adresse Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="fondateur@senpay.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm disabled:opacity-70"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Vous n'avez pas de profil ?{" "}
                <Link
                  href="/register"
                  onClick={() => setShowLoginModal(false)}
                  className="text-brand-active font-bold hover:underline"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
