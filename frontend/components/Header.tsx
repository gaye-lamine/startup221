"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { API } from "../lib/api";
import { ShieldCheck, LogOut, UserCheck, Lock, Menu, X } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // States for user roles
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [startupName, setStartupName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    setShowMobileMenu(false); // Close mobile menu on page transition
  }, [pathname]);

  const checkAuthStatus = () => {
    const adminToken = sessionStorage.getItem("admin_token");
    const adminSession = !!(adminToken && adminToken.trim().length > 0);
    const startupSession = localStorage.getItem("startup_session") === "true";

    setIsAdmin(adminSession);
    if (startupSession) {
      setIsLoggedIn(true);
      setStartupName(localStorage.getItem("startup_name") || "Ma Startup");
    } else {
      setIsLoggedIn(false);
    }
  };

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
        setStartupName(data.name);
        localStorage.setItem("startup_session", "true");
        localStorage.setItem("startup_slug", data.slug);
        localStorage.setItem("startup_name", data.name);
        localStorage.setItem("startup_token", data.token);
        
        setShowLoginModal(false);
        router.push("/dashboard");
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
    setIsAdmin(false);
    localStorage.removeItem("startup_session");
    localStorage.removeItem("startup_slug");
    localStorage.removeItem("startup_name");
    localStorage.removeItem("startup_token");
    sessionStorage.removeItem("admin_token");
    router.push("/");
  };

  return (
    <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-principal.svg" alt="StartupSN Logo" className="h-8 w-auto" />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 h-16">
            <Link
              href="/"
              className={`text-xs font-bold h-full flex items-center px-1 border-b-2 transition-all ${
                pathname === "/" ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
              }`}
            >
              Startups
            </Link>
            <Link
              href="/investors"
              className={`text-xs font-bold h-full flex items-center px-1 border-b-2 transition-all ${
                pathname === "/investors" ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
              }`}
            >
              Investisseurs
            </Link>
            <Link
              href="/partners"
              className={`text-xs font-bold h-full flex items-center px-1 border-b-2 transition-all ${
                pathname === "/partners" ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
              }`}
            >
              Incubateurs & Partenaires
            </Link>
            <Link
              href="/opportunities"
              className={`text-xs font-bold h-full flex items-center px-1 border-b-2 transition-all ${
                pathname === "/opportunities" ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
              }`}
            >
              Appels à projets
            </Link>
            <Link
              href="/resources"
              className={`text-xs font-bold h-full flex items-center px-1 border-b-2 transition-all ${
                pathname === "/resources" ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
              }`}
            >
              Ressources
            </Link>

            {/* Dynamic Dashboard/Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`text-xs font-extrabold h-full flex items-center px-1 border-b-2 transition-all text-amber-600 border-amber-500`}
              >
                Console Admin
              </Link>
            )}
            {isLoggedIn && !isAdmin && (
              <Link
                href="/dashboard"
                className={`text-xs font-bold h-full flex items-center px-1 border-b-2 transition-all ${
                  pathname.startsWith("/dashboard") ? "text-brand-active border-brand-active" : "text-slate-500 hover:text-slate-900 border-transparent"
                }`}
              >
                Tableau de Bord
              </Link>
            )}
          </nav>
        </div>

        {/* Right Side - Desktop Navigation Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAdmin ? (
            /* Admin Logged-In State */
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Session Administrateur</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all"
              >
                Déconnexion
              </button>
            </div>
          ) : isLoggedIn ? (
            /* Founder Logged-In State */
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-slate-700 hover:text-brand-active flex items-center gap-1.5 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{startupName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 border border-rose-100 hover:bg-rose-100/50 px-3 py-1.5 rounded-lg uppercase tracking-wider"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            /* Public Anonymous Visitor State */
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
              >
                Se connecter
              </button>
              <Link
                href="/register"
                className="text-xs sm:text-sm font-bold bg-brand-active text-white px-4 sm:px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
              >
                Inscrire ma Startup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {isAdmin && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-md">
              Admin
            </span>
          )}
          {isLoggedIn && !isAdmin && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md">
              Actif
            </span>
          )}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              className={`text-xs font-bold py-2.5 px-3 rounded-lg transition-all ${
                pathname === "/" ? "bg-brand-50 text-brand-active" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Startups
            </Link>
            <Link
              href="/investors"
              className={`text-xs font-bold py-2.5 px-3 rounded-lg transition-all ${
                pathname === "/investors" ? "bg-brand-50 text-brand-active" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Investisseurs
            </Link>
            <Link
              href="/partners"
              className={`text-xs font-bold py-2.5 px-3 rounded-lg transition-all ${
                pathname === "/partners" ? "bg-brand-50 text-brand-active" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Incubateurs & Partenaires
            </Link>
            <Link
              href="/opportunities"
              className={`text-xs font-bold py-2.5 px-3 rounded-lg transition-all ${
                pathname === "/opportunities" ? "bg-brand-50 text-brand-active" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Appels à projets
            </Link>
            <Link
              href="/resources"
              className={`text-xs font-bold py-2.5 px-3 rounded-lg transition-all ${
                pathname === "/resources" ? "bg-brand-50 text-brand-active" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Ressources
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-xs font-extrabold py-2.5 px-3 rounded-lg bg-amber-50 text-amber-700 border border-amber-100"
              >
                Console Admin
              </Link>
            )}
            {isLoggedIn && !isAdmin && (
              <Link
                href="/dashboard"
                className="text-xs font-bold py-2.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                Tableau de Bord ({startupName})
              </Link>
            )}
          </nav>

          {/* Action buttons inside mobile drawer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAdmin || isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl hover:bg-slate-100 transition-all text-center"
                >
                  Se connecter
                </button>
                <Link
                  href="/register"
                  className="w-full bg-brand-active text-white text-xs font-bold py-3 rounded-xl hover:bg-brand-600 transition-all text-center block shadow-sm"
                >
                  Inscrire ma Startup
                </Link>
              </>
            )}
          </div>
        </div>
      )}

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
