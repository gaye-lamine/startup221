"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API } from "../../lib/api";
import { Lock, Plus, Trash2 } from "lucide-react";

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

interface InvestorDirectoryItem {
  id: string;
  name: string;
  entity_type: string;
  city: string;
  ticket_size: string;
  website_url: string;
}

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  file_type: string;
  file_url: string;
}

export default function AdminPage() {
  const adminLoginUrl = API.admin.login;

  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [passError, setPassError] = useState(false);

  const [activeTab, setActiveTab] = useState<"investors" | "startups" | "partners" | "programs" | "investorsDir" | "resources">("investors");
  const [investors, setInvestors] = useState<InvestorLead[]>([]);
  const [startups, setStartups] = useState<StartupSummary[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [investorsDir, setInvestorsDir] = useState<InvestorDirectoryItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
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
  const newProgCategory = "Concours";
  const [newProgDeadline, setNewProgDeadline] = useState("");
  const [newProgDesc, setNewProgDesc] = useState("");
  const [newProgUrl, setNewProgUrl] = useState("");

  const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
  const [newInvName, setNewInvName] = useState("");
  const [newInvEmail, setNewInvEmail] = useState("");
  const [newInvEntityType, setNewInvEntityType] = useState("Business Angel");
  const [newInvCity, setNewInvCity] = useState("Dakar");
  const [newInvBio, setNewInvBio] = useState("");
  const [newInvTicket, setNewInvTicket] = useState("10M - 50M FCFA");
  const [newInvWebsite, setNewInvWebsite] = useState("");
  const [newInvLinkedin, setNewInvLinkedin] = useState("");

  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResTitle, setNewResTitle] = useState("");
  const [newResCategory, setNewResCategory] = useState("Modèle Document");
  const [newResDesc, setNewResDesc] = useState("");
  const [newResFileType, setNewResFileType] = useState("PDF");
  const [newResFileUrl, setNewResFileUrl] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) {
      setAdminAuthenticated(true);
      loadAdminData(token);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(adminLoginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      if (!res.ok) {
        setPassError(true);
        return;
      }

      const data = await res.json();
      sessionStorage.setItem("admin_token", data.token);
      setAdminAuthenticated(true);
      setPassError(false);
      setAdminPassword("");
      loadAdminData(data.token);
    } catch (error) {
      console.error("Admin login error", error);
      setPassError(true);
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("admin_token");
    setAdminAuthenticated(false);
    setAdminPassword("");
  };

  async function loadAdminData(tokenOverride?: string) {
    const token = tokenOverride ?? sessionStorage.getItem("admin_token");
    if (!token) {
      setAdminAuthenticated(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [invRes, stRes, partRes, progRes, invDirRes, resRes] = await Promise.all([
        fetch(API.admin.investors, { headers }),
        fetch(API.admin.startups, { headers }),
        fetch(API.partners.list, { headers }),
        fetch(API.partners.programs, { headers }),
        fetch(API.investors.directory, { headers }),
        fetch(API.partners.resources, { headers }),
      ]);

      if ([invRes, stRes, partRes, progRes, invDirRes, resRes].some((res) => res.status === 401 || res.status === 403)) {
        sessionStorage.removeItem("admin_token");
        setAdminAuthenticated(false);
        setError("Session administrateur expirée.");
        return;
      }

      if (invRes.ok) setInvestors(await invRes.json());
      if (stRes.ok) setStartups(await stRes.json());
      if (partRes.ok) setPartners(await partRes.json());
      if (progRes.ok) setPrograms(await progRes.json());
      if (invDirRes.ok) setInvestorsDir(await invDirRes.json());
      if (resRes.ok) setResources(await resRes.json());
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
    link.remove();
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("admin_token");
      const slug = newPartnerName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await fetch(API.partners.list, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(API.partners.delete(id), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error("Error deleting partner", err);
    }
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(API.partners.programs, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(API.partners.programDelete(id), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error("Error deleting program", err);
    }
  };

  const handleCreateInvestor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("admin_token");
      const slug = newInvName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const res = await fetch(API.investors.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: newInvName,
          slug,
          email: newInvEmail,
          entity_type: newInvEntityType,
          bio: newInvBio,
          ticket_size: newInvTicket,
          city: newInvCity,
          website_url: newInvWebsite,
          linkedin_url: newInvLinkedin,
          investment_stages: [],
          sectors: [],
        }),
      });
      if (res.ok) {
        setShowAddInvestorModal(false);
        setNewInvName(""); setNewInvEmail(""); setNewInvBio("");
        setNewInvWebsite(""); setNewInvLinkedin("");
        loadAdminData();
      }
    } catch (err) {
      console.error("Error creating investor", err);
    }
  };

  const handleDeleteInvestor = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet investisseur ?")) return;
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(API.investors.delete(id), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error("Error deleting investor", err);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(API.partners.resources, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: newResTitle,
          category: newResCategory,
          description: newResDesc,
          file_type: newResFileType,
          file_url: newResFileUrl,
        }),
      });
      if (res.ok) {
        setShowAddResourceModal(false);
        setNewResTitle(""); setNewResDesc(""); setNewResFileUrl("");
        loadAdminData();
      }
    } catch (err) {
      console.error("Error creating resource", err);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette ressource ?")) return;
    try {
      const token = sessionStorage.getItem("admin_token");
      const res = await fetch(API.partners.resourceDelete(id), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) loadAdminData();
    } catch (err) {
      console.error("Error deleting resource", err);
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
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Startups</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{startups.length}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Incubateurs</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{partners.length}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Appels à Projets</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{programs.length}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Investisseurs</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{investorsDir.length}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ressources</p>
            <p className="text-2xl font-extrabold text-brand-dark mt-1">{resources.length}</p>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Leads & Abonnés</p>
              <p className="text-2xl font-extrabold text-brand-dark mt-1">{investors.length}</p>
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
        <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          {[
            { id: "investors",    label: `Leads / Newsletter (${investors.length})` },
            { id: "startups",     label: `Startups (${startups.length})` },
            { id: "partners",     label: `Incubateurs (${partners.length})` },
            { id: "programs",     label: `Appels à Projets (${programs.length})` },
            { id: "investorsDir", label: `Investisseurs (${investorsDir.length})` },
            { id: "resources",    label: `Ressources (${resources.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-extrabold border-b-2 transition-all shrink-0 ${
                activeTab === tab.id
                  ? "border-brand-active text-brand-active"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content — action buttons */}
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

        {activeTab === "investorsDir" && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddInvestorModal(true)}
              className="bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un investisseur</span>
            </button>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddResourceModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une ressource</span>
            </button>
          </div>
        )}

        {/* Table Renderers */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">Chargement...</div>
        ) : activeTab === "partners" ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
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
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
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
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
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
        ) : activeTab === "investorsDir" ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Nom</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Ville</th>
                  <th className="py-3.5 px-6">Ticket</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {investorsDir.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-extrabold text-slate-800">{inv.name}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{inv.entity_type}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{inv.city}</td>
                    <td className="py-4 px-6 font-semibold text-brand-active">{inv.ticket_size}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteInvestor(inv.id)}
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
        ) : activeTab === "resources" ? (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">Titre</th>
                  <th className="py-3.5 px-6">Catégorie</th>
                  <th className="py-3.5 px-6">Format</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/50">
                    <td className="py-4 px-6 font-extrabold text-slate-800">{res.title}</td>
                    <td className="py-4 px-6 font-semibold text-slate-500">{res.category}</td>
                    <td className="py-4 px-6">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded">
                        {res.file_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteResource(res.id)}
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
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
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
      {/* Add Investor Modal */}
      {showAddInvestorModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-extrabold text-slate-900">Ajouter un Investisseur / Fonds</h3>
            <form onSubmit={handleCreateInvestor} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Nom (ex: Teranga Capital)"
                value={newInvName}
                onChange={(e) => setNewInvName(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <input
                type="email"
                required
                placeholder="Email (ex: contact@terangacapital.com)"
                value={newInvEmail}
                onChange={(e) => setNewInvEmail(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <select
                value={newInvEntityType}
                onChange={(e) => setNewInvEntityType(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              >
                <option value="Business Angel">Business Angel</option>
                <option value="VC / Fonds">VC / Fonds</option>
                <option value="Family Office">Family Office</option>
                <option value="Institution">Institution</option>
              </select>
              <input
                type="text"
                placeholder="Ville (ex: Dakar)"
                value={newInvCity}
                onChange={(e) => setNewInvCity(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="Ticket (ex: 50M - 300M FCFA)"
                value={newInvTicket}
                onChange={(e) => setNewInvTicket(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <textarea
                placeholder="Biographie / présentation..."
                value={newInvBio}
                onChange={(e) => setNewInvBio(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs h-20"
              />
              <input
                type="text"
                placeholder="Site Web (ex: https://terangacapital.com)"
                value={newInvWebsite}
                onChange={(e) => setNewInvWebsite(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <input
                type="text"
                placeholder="LinkedIn (ex: https://linkedin.com/company/...)"
                value={newInvLinkedin}
                onChange={(e) => setNewInvLinkedin(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddInvestorModal(false)}
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

      {/* Add Resource Modal */}
      {showAddResourceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Ajouter une Ressource</h3>
            <form onSubmit={handleCreateResource} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Titre (ex: Guide Startup Act Sénégal)"
                value={newResTitle}
                onChange={(e) => setNewResTitle(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <select
                value={newResCategory}
                onChange={(e) => setNewResCategory(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              >
                <option value="Modèle Document">Modèle Document</option>
                <option value="Guide Juridique">Guide Juridique</option>
                <option value="Startup Act">Startup Act</option>
                <option value="Formation">Formation</option>
              </select>
              <select
                value={newResFileType}
                onChange={(e) => setNewResFileType(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              >
                <option value="PDF">PDF</option>
                <option value="PPTX">PPTX</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
              </select>
              <textarea
                placeholder="Description de la ressource..."
                value={newResDesc}
                onChange={(e) => setNewResDesc(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs h-20"
              />
              <input
                type="text"
                required
                placeholder="URL du fichier (ex: https://startups.sn/guide.pdf)"
                value={newResFileUrl}
                onChange={(e) => setNewResFileUrl(e.target.value)}
                className="w-full border border-slate-200 p-3 rounded-xl text-xs"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddResourceModal(false)}
                  className="w-1/2 bg-slate-100 text-slate-600 font-bold text-xs py-3 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-blue-600 text-white font-bold text-xs py-3 rounded-xl"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
