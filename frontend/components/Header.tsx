"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulated logged-in state using localStorage for cross-page persistence
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("startup_session");
    if (session === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      const res = await fetch(API.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        localStorage.setItem("startup_session", "true");
        localStorage.setItem("startup_slug", data.slug);
        localStorage.setItem("startup_name", data.name);
        
        setShowLoginModal(false);
        router.push("/dashboard");
        window.location.reload(); // Force refresh to re-evaluate the header
      } else {
        const data = await res.json();
        setLoginError(data.detail || "Identifiants invalides.");
      }
    } catch (err) {
      setLoginError("Impossible de contacter le serveur d'authentification.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("startup_session");
    localStorage.removeItem("startup_slug");
    localStorage.removeItem("startup_name");
    router.push("/");
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
              className={`text-sm font-semibold h-full flex items-center px-1 border-b-2 transition-all ${
                pathname === "/" ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
              }`}
            >
              Directory
            </Link>
            <button
              onClick={() => alert("À propos : Startup221 connecte l'écosystème tech sénégalais avec les investisseurs mondiaux.")}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors h-full flex items-center px-1 border-b-2 border-transparent"
            >
              About
            </button>

            {/* Conditionally render For Investors or Dashboard depending on login state */}
            {!isLoggedIn ? (
              <Link
                href="/for-investors"
                className={`text-sm font-semibold h-full flex items-center px-1 border-b-2 transition-all ${
                  pathname === "/for-investors" ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
                }`}
              >
                For Investors
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className={`text-sm font-semibold h-full flex items-center px-1 border-b-2 transition-all ${
                  pathname.startsWith("/dashboard") ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {!isLoggedIn ? (
            <>
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
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Logout
            </button>
          )}
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

            {loginError && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-xs font-semibold mb-4">
                {loginError}
              </div>
            )}

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
