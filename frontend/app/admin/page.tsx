"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import { Lock, Plus, Trash2, Building, Building2, Sparkles, BookOpen } from "lucide-react";

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

interface PartnerItem {
  id: string;
  name: string;
  partner_type: string;
  city: string;
  website_url: string;
}

interface ProgramItem {
  id: string;
  title: string;
  partner_name: string;
  category: string;
  deadline: string;
}

export default function AdminPage() {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passError, setPassError] = useState(false);

  const [activeTab, setActiveTab] = useState<"investors" | "startups" | "partners" | "programs">("investors");
  const [investors, setInvestors] = useState<InvestorLead[]>([]);
  const [startups, setStartups] = useState<StartupSummary[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New item modal states
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerType, setNewPartnerType] = useState("Incubateur");
  const [newPartnerCity, setNewPartnerCity] = useState("Dakar");
  const [newPartnerDesc, setNewPartnerDesc] = useState("");
  const [newPartnerUrl, setNewPartnerUrl] = useState("");

  const [showAddProgramModal, setShowAddProgramModal] = useState(false);
  const [newProgTitle, setNewProgTitle] = useState("");
  const [newProgPartner, setNewProgPartner] = useState("");
  const [newProgCategory, setNewProgCategory] = useState("Concours");
  const [newProgDeadline, setNewProgDeadline] = useState("");
  const [newProgDesc, setNewProgDesc] = useState("");
  const [newProgUrl, setNewProgUrl] = useState("");

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_session") === "true";
    if (isAuth) {
      setAdminAuthenticated(true);
      loadAdminData();
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
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
      const [invRes, stRes, partRes, progRes] = await Promise.all([
        fetch(API.admin.investors),
        fetch(API.admin.startups),
        fetch(API.partners.list),
        fetch(API.partners.programs),
      ]);

      if (invRes.ok) setInvestors(await invRes.json());
      if (stRes.ok) setStartups(await stRes.json());
      if (partRes.ok) setPartners(await partRes.json());
      if (progRes.ok) setPrograms(await progRes.json());
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

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = newPartnerName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await fetch(API.partners.list, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPartnerName,
          slug,
          partner_type: newPartnerType,
          description: newPartnerDesc,
          city: newPartnerCity,
          website_url: newPartnerUrl,
        }),
      });

      if (res.ok) {
        setShowAddPartnerModal(false);
        setNewPartnerName("");
        setNewPartnerDesc("");
        loadAdminData();
      }
    } catch (err) {
      console.error("Error creating partner", err);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;
    try {
      const res = await fetch(`${API.partners.list}/${id}`, { method: "DELETE" });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error("Error deleting partner", err);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API.partners.programs, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProgTitle,
          partner_name: newProgPartner,
          category: newProgCategory,
          deadline: newProgDeadline,
          description: newProgDesc,
          apply_url: newProgUrl,
          target_sectors: ["Tech", "Innovation"],
        }),
      });

      if (res.ok) {
        setShowAddProgramModal(false);
        setNewProgTitle("");
        setNewProgDesc("");
        loadAdminData();
      }
    } catch (err) {
      console.error("Error creating program", err);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet appel à projets ?")) return;
    try {
      const res = await fetch(`${API.partners.programs}/${id}`, { method: "DELETE" });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error("Error deleting program", err);
    }
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
              Console d&apos;Administration Générale
            </span>
            <h1 className="text-3xl font-extrabold text-brand-dark mt-2 tracking-tight">
              Gestion Dynamique de l&apos;Écosystème
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Superviser les startups, ajouter/supprimer des incubateurs, appels à projets et ressources en temps réel.
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Startups Inscrites
            </p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">
              {startups.length}
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Incubateurs & Partenaires
            </p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">
              {partners.length}
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Appels à Projets
            </p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">
              {programs.length}
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Leads & Abonnés
              </p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">
                {investors.length}
              </p>
            </div>
            <button
              onClick={exportInvestorsCSV}
              disabled={investors.length === 0}
              className="bg-brand-active text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-sm disabled:opacity-50"
            >
              CSV &darr;
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 gap-6">
          {[
            { id: "investors", label: `Inscrits / Newsletter (${investors.length})` },
            { id: "startups", label: `Startups (${startups.length})` },
            { id: "partners", label: `Incubateurs (${partners.length})` },
            { id: "programs", label: `Appels à Projets (${programs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-extrabold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-brand-active text-brand-active"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        {activeTab === "partners" && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddPartnerModal(true)}
              className="bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un partenaire / incubateur</span>
            </button>
          </div>
        )}

        {activeTab === "programs" && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddProgramModal(true)}
              className="bg-brand-gold text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publier un appel à projets</span>
            </button>
          </div>
        )}

        {/* Table Renderers */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Chargement...</div>
        ) : activeTab === "partners" ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Nom du Partenaire</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Ville</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-extrabold text-slate-800">{p.name}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{p.partner_type}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{p.city}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeletePartner(p.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "programs" ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Titre de l&apos;Appel à Projets</th>
                  <th className="py-3.5 px-6">Proposé Par</th>
                  <th className="py-3.5 px-6">Catégorie</th>
                  <th className="py-3.5 px-6">Date Limite</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {programs.map((prg) => (
                  <tr key={prg.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-extrabold text-slate-800">{prg.title}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{prg.partner_name}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{prg.category}</td>
                    <td className="py-4 px-6 font-semibold text-red-600">{prg.deadline}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteProgram(prg.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "investors" ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Adresse E-mail</th>
                  <th className="py-3.5 px-6">Statut</th>
                  <th className="py-3.5 px-6">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {investors.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-extrabold text-slate-800">{inv.email}</td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {new Date(inv.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Startup</th>
                  <th className="py-3.5 px-6">Secteur</th>
                  <th className="py-3.5 px-6">Ville</th>
                  <th className="py-3.5 px-6">Créée le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {startups.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6">
                      <Link href={`/startup/${st.slug}`} className="font-extrabold text-brand-active">
                        {st.name}
                      </Link>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{st.sector}</td>
                    <td className="py-4 px-6 font-medium text-slate-600">{st.city}</td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {new Date(st.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Partner Modal */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Ajouter un Incubateur / Partenaire</h3>
            <form onSubmit={handleCreatePartner} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nom (ex: CTIC Dakar)"
                value={newPartnerName}
                onChange={(e) => setNewPartnerName(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <select
                value={newPartnerType}
                onChange={(e) => setNewPartnerType(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              >
                <option value="Incubateur">Incubateur</option>
                <option value="Accélérateur">Accélérateur</option>
                <option value="Institution">Institution</option>
                <option value="Hub Tech">Hub Tech</option>
              </select>
              <input
                type="text"
                required
                placeholder="Ville (ex: Dakar)"
                value={newPartnerCity}
                onChange={(e) => setNewPartnerCity(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <textarea
                required
                placeholder="Description rapide..."
                value={newPartnerDesc}
                onChange={(e) => setNewPartnerDesc(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs h-20"
              />
              <input
                type="text"
                placeholder="Site Web (ex: https://der.sn)"
                value={newPartnerUrl}
                onChange={(e) => setNewPartnerUrl(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPartnerModal(false)}
                  className="w-1/2 bg-slate-100 text-slate-600 font-bold text-xs py-3 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-brand-active text-white font-bold text-xs py-3 rounded-xl"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgramModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Publier un Appel à Projets</h3>
            <form onSubmit={handleCreateProgram} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Titre de l'appel (ex: FAIN 2026)"
                value={newProgTitle}
                onChange={(e) => setNewProgTitle(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <input
                type="text"
                required
                placeholder="Organisateur (ex: DER/FJ)"
                value={newProgPartner}
                onChange={(e) => setNewProgPartner(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <input
                type="text"
                required
                placeholder="Date limite (ex: 30 Septembre 2026)"
                value={newProgDeadline}
                onChange={(e) => setNewProgDeadline(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <textarea
                required
                placeholder="Description du programme..."
                value={newProgDesc}
                onChange={(e) => setNewProgDesc(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs h-20"
              />
              <input
                type="text"
                required
                placeholder="Lien de candidature (ex: https://der.sn/postuler)"
                value={newProgUrl}
                onChange={(e) => setNewProgUrl(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProgramModal(false)}
                  className="w-1/2 bg-slate-100 text-slate-600 font-bold text-xs py-3 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-brand-gold text-white font-bold text-xs py-3 rounded-xl"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
