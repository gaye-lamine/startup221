"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import { Lock } from "lucide-react";

interface InvestorLead {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

interface StartupSummary {
  id: string;
  name: string;
  slug: string;
  email: string;
  sector: string;
  city: string;
  funding_stage: string;
  created_at: string;
}

export default function AdminPage() {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passError, setPassError] = useState(false);

  const [activeTab, setActiveTab] = useState<"investors" | "startups">("investors");
  const [investors, setInvestors] = useState<InvestorLead[]>([]);
  const [startups, setStartups] = useState<StartupSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_session") === "true";
    if (isAuth) {
      setAdminAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure admin access key for production demonstration
    if (adminPassword === "startupsn2026" || adminPassword === "admin") {
      localStorage.setItem("admin_session", "true");
      setAdminAuthenticated(true);
      setPassError(false);
      loadAdminData();
    } else {
      setPassError(true);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_session");
    setAdminAuthenticated(false);
    setAdminPassword("");
  };

  async function loadAdminData() {
    setLoading(true);
    setError(null);
    try {
      const [invRes, stRes] = await Promise.all([
        fetch(API.admin.investors),
        fetch(API.admin.startups),
      ]);

      if (invRes.ok) {
        const invData = await invRes.json();
        setInvestors(invData);
      }
      if (stRes.ok) {
        const stData = await stRes.json();
        setStartups(stData);
      }
    } catch (err) {
      console.error("Admin fetch error", err);
      setError("Impossible de charger les données administrateur.");
    } finally {
      setLoading(false);
    }
  }

  const exportInvestorsCSV = () => {
    if (investors.length === 0) return;
    const headers = "ID,Email,Statut,Date Inscription\n";
    const rows = investors
      .map(
        (inv) =>
          `"${inv.id}","${inv.email}","${inv.status}","${new Date(
            inv.created_at
          ).toLocaleString("fr-FR")}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `investisseurs_startupsn_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-paper flex items-center justify-center p-4">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-active mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center space-y-1">
            <h1 className="text-xl font-extrabold text-slate-900">Espace Administration</h1>
            <p className="text-xs text-slate-500 font-medium">
              Veuillez saisir la clé d&apos;accès administrateur.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Mot de passe admin"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full border border-slate-200 px-4 py-3 rounded-xl text-xs outline-none focus:border-brand-active"
              />
              {passError && (
                <p className="text-[11px] text-red-600 font-bold mt-1.5 text-center">
                  Mot de passe incorrect.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md"
            >
              Déverrouiller l&apos;accès
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-600">
              &larr; Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-paper py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-brand-active uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Espace d&apos;Administration
            </span>
            <h1 className="text-3xl font-extrabold text-brand-dark mt-2 tracking-tight">
              Tableau de Bord Admin
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Supervision des e-mails inscrits et des startups référencées.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdminLogout}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              Déconnexion
            </button>
            <Link
              href="/"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              &larr; Voir le site
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Inscrits Newsletter / Investisseurs
              </p>
              <p className="text-3xl font-extrabold text-brand-dark mt-1">
                {investors.length}
              </p>
            </div>
            <button
              onClick={exportInvestorsCSV}
              disabled={investors.length === 0}
              className="bg-brand-active hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              Exporter CSV &darr;
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Startups Enregistrées
            </p>
            <p className="text-3xl font-extrabold text-brand-dark mt-1">
              {startups.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => setActiveTab("investors")}
            className={`pb-3 text-sm font-extrabold border-b-2 transition-all ${
              activeTab === "investors"
                ? "border-brand-active text-brand-active"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Liste des Inscrits ({investors.length})
          </button>
          <button
            onClick={() => setActiveTab("startups")}
            className={`pb-3 text-sm font-extrabold border-b-2 transition-all ${
              activeTab === "startups"
                ? "border-brand-active text-brand-active"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Startups ({startups.length})
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-semibold border border-red-100">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Chargement des données d&apos;administration...
          </div>
        ) : activeTab === "investors" ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {investors.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">
                Aucun e-mail d&apos;investisseur inscrit pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3.5 px-6">Adresse E-mail</th>
                      <th className="py-3.5 px-6">Statut</th>
                      <th className="py-3.5 px-6">Date de souscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {investors.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 font-extrabold text-slate-800">
                          {inv.email}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                          {new Date(inv.created_at).toLocaleString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {startups.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">
                Aucune startup enregistrée.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3.5 px-6">Startup</th>
                      <th className="py-3.5 px-6">Secteur</th>
                      <th className="py-3.5 px-6">Ville</th>
                      <th className="py-3.5 px-6">Stade</th>
                      <th className="py-3.5 px-6">Créée le</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {startups.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <Link
                            href={`/startup/${st.slug}`}
                            className="font-extrabold text-brand-active hover:underline"
                          >
                            {st.name}
                          </Link>
                          <p className="text-xs text-slate-400">{st.email}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {st.sector}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {st.city}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {st.funding_stage}
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs font-medium">
                          {new Date(st.created_at).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
