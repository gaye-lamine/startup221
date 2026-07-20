"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API } from "../../../lib/api";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar_url: string;
  linkedin_url: string;
}

interface StartupNeed {
  id: string;
  category: string;
  need_type: string;
  title: string;
  description: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    funding_stage: "",
    city: "",
    website_url: "",
    linkedin_url: "",
    twitter_url: "",
    logo_url: "",
    employee_count: 1,
    problem_statement: "",
    solution_statement: "",
  });

  // Team & Needs States
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [needs, setNeeds] = useState<StartupNeed[]>([]);

  // Team Member Form State
  const [newMember, setNewMember] = useState({ name: "", role: "", linkedin_url: "" });
  const [addingMember, setAddingMember] = useState(false);

  // Need Form State
  const [newNeed, setNewNeed] = useState({ category: "Investissement", title: "", description: "" });
  const [addingNeed, setAddingNeed] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("startup_session");
    const storedSlug = localStorage.getItem("startup_slug");
    if (session !== "true" || !storedSlug) {
      router.push("/");
    } else {
      setSlug(storedSlug);
    }
  }, [router]);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      const token = localStorage.getItem("startup_token");
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      try {
        // Load Profile
        const res = await fetch(API.startups.bySlug(slug));
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name || "",
            description: data.description || "",
            funding_stage: data.funding_stage || "",
            city: data.city || "",
            website_url: data.website_url || "",
            linkedin_url: data.linkedin_url || "",
            twitter_url: data.twitter_url || "",
            logo_url: data.logo_url || "",
            employee_count: data.employee_count || 1,
            problem_statement: data.problem_statement || "",
            solution_statement: data.solution_statement || "",
          });
        }

        // Load Team
        const teamRes = await fetch(API.dashboard.team(slug), { headers });
        if (teamRes.ok) {
          const teamData = await teamRes.json();
          setTeam(teamData);
        }

        // Load Needs
        const needsRes = await fetch(API.dashboard.needs(slug), { headers });
        if (needsRes.ok) {
          const needsData = await needsRes.json();
          setNeeds(needsData);
        }
      } catch (err) {
        console.error("Error loading profile data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(API.startups.upload, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, logo_url: data.secure_url }));
        setMessage("Logo téléversé avec succès !");
      } else {
        setMessage("Erreur : Le téléversement du logo a échoué.");
      }
    } catch (err) {
      setMessage("Erreur de connexion lors du téléversement.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.profile(slug), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("Profil mis à jour avec succès !");
      } else {
        setMessage("Une erreur est survenue lors de la mise à jour.");
      }
    } catch (err) {
      setMessage("Erreur de connexion avec le serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Team Handlers ────────────────────────────────────────────────────────
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !newMember.name || !newMember.role) return;
    setAddingMember(true);
    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.team(slug), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newMember),
      });
      if (res.ok) {
        const created = await res.json();
        setTeam((prev) => [...prev, created]);
        setNewMember({ name: "", role: "", linkedin_url: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!slug) return;
    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.teamDelete(slug, memberId), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok || res.status === 204) {
        setTeam((prev) => prev.filter((m) => m.id !== memberId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ─── Needs Handlers ───────────────────────────────────────────────────────
  const handleAddNeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !newNeed.title || !newNeed.description) return;
    setAddingNeed(true);
    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.needs(slug), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          category: newNeed.category,
          need_type: "Besoin",
          title: newNeed.title,
          description: newNeed.description,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setNeeds((prev) => [...prev, created]);
        setNewNeed({ category: "Investissement", title: "", description: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingNeed(false);
    }
  };

  const handleDeleteNeed = async (needId: string) => {
    if (!slug) return;
    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.needsDelete(slug, needId), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok || res.status === 204) {
        setNeeds((prev) => prev.filter((n) => n.id !== needId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen text-slate-500 font-medium">
        Chargement des données du profil...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[760px] mx-auto space-y-10">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Édition du Profil</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Mettez à jour les informations publiques de votre startup.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold ${
            message.includes("succès")
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-red-50 text-red-700 border border-red-100"
          }`}
        >
          {message}
        </div>
      )}

      {/* ─── SECTION 1: INFORMATIONS GÉNÉRALES ─── */}
      <form onSubmit={handleSubmitProfile} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          Informations Générales
        </h2>

        {/* Section Logo */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Logo de la Startup
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 overflow-hidden shrink-0">
              {form.logo_url && form.logo_url.startsWith("http") ? (
                <img src={form.logo_url} alt="Aperçu logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-slate-300 text-xs font-bold uppercase">Aucun</span>
              )}
            </div>

            <div className="flex-grow w-full space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="URL du logo"
                  value={form.logo_url}
                  onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                  className="flex-grow border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
                />
                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center">
                  {uploading ? "Envoi..." : "Téléverser"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Nom & Stade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nom de la startup
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Stade de financement
            </label>
            <select
              value={form.funding_stage}
              onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active bg-white"
            >
              <option value="Idéation">Idéation</option>
              <option value="Amorçage / Seed">Amorçage / Seed</option>
              <option value="Série A">Série A</option>
              <option value="Série B+">Série B+</option>
            </select>
          </div>
        </div>

        {/* Collaborateurs & Ville */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nombre de collaborateurs
            </label>
            <input
              type="number"
              min={1}
              value={form.employee_count}
              onChange={(e) => setForm({ ...form, employee_count: parseInt(e.target.value) || 1 })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Ville & Pays
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
            />
          </div>
        </div>

        {/* Description Courte */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Description courte
          </label>
          <input
            type="text"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
          />
        </div>

        {/* Problème & Solution */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Le Problème ciblé
            </label>
            <textarea
              rows={3}
              value={form.problem_statement}
              onChange={(e) => setForm({ ...form, problem_statement: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Votre Solution
            </label>
            <textarea
              rows={3}
              value={form.solution_statement}
              onChange={(e) => setForm({ ...form, solution_statement: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-70"
        >
          {submitting ? "Enregistrement..." : "Enregistrer les informations"}
        </button>
      </form>

      {/* ─── SECTION 2: GESTION DE L'ÉQUIPE ─── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          Membres de l&apos;Équipe
        </h2>

        {/* Formulaire ajout membre */}
        <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          <input
            type="text"
            required
            placeholder="Nom complet"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            className="border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none bg-white focus:border-brand-active"
          />
          <input
            type="text"
            required
            placeholder="Rôle (ex: CEO, CTO)"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            className="border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none bg-white focus:border-brand-active"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Lien LinkedIn"
              value={newMember.linkedin_url}
              onChange={(e) => setNewMember({ ...newMember, linkedin_url: e.target.value })}
              className="flex-grow border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none bg-white focus:border-brand-active"
            />
            <button
              type="submit"
              disabled={addingMember}
              className="bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-lg shrink-0"
            >
              +
            </button>
          </div>
        </form>

        {/* Liste des membres */}
        {team.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium italic">Aucun membre d&apos;équipe enregistré.</p>
        ) : (
          <div className="space-y-2">
            {team.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-slate-800">{m.name}</span> —{" "}
                  <span className="text-slate-500">{m.role}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMember(m.id)}
                  className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── SECTION 3: RECHERCHES & BESOINS ─── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
          Recherches & Besoins de la Startup
        </h2>

        {/* Formulaire ajout besoin */}
        <form onSubmit={handleAddNeed} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={newNeed.category}
              onChange={(e) => setNewNeed({ ...newNeed, category: e.target.value })}
              className="border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none bg-white focus:border-brand-active"
            >
              <option value="Investissement">Investissement</option>
              <option value="Partenariat">Partenariat</option>
              <option value="Recrutement">Recrutement</option>
            </select>
            <input
              type="text"
              required
              placeholder="Titre du besoin (ex: Levée Seed 50M FCFA)"
              value={newNeed.title}
              onChange={(e) => setNewNeed({ ...newNeed, title: e.target.value })}
              className="border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none bg-white focus:border-brand-active"
            />
          </div>
          <div className="flex gap-2">
            <textarea
              rows={2}
              required
              placeholder="Description détaillée du besoin..."
              value={newNeed.description}
              onChange={(e) => setNewNeed({ ...newNeed, description: e.target.value })}
              className="flex-grow border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none bg-white focus:border-brand-active resize-none"
            />
            <button
              type="submit"
              disabled={addingNeed}
              className="bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-5 py-2 rounded-lg shrink-0 self-end"
            >
              Ajouter
            </button>
          </div>
        </form>

        {/* Liste des besoins */}
        {needs.length === 0 ? (
          <p className="text-xs text-slate-400 font-medium italic">Aucun besoin ou recherche enregistré.</p>
        ) : (
          <div className="space-y-2">
            {needs.map((n) => (
              <div key={n.id} className="flex items-start justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs gap-4">
                <div>
                  <span className="font-bold text-brand-active uppercase text-[10px] bg-brand-50 px-2 py-0.5 rounded border border-brand-100 mr-2">
                    {n.category}
                  </span>
                  <strong className="text-slate-800">{n.title}</strong>
                  <p className="text-slate-500 text-[11px] mt-1">{n.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteNeed(n.id)}
                  className="text-red-500 hover:text-red-700 font-bold px-2 py-1 shrink-0"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
