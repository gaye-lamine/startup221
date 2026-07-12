"use client";

import React, { useState, useEffect } from "react";
import { API } from "../../../lib/api";

export default function EditProfilePage() {
  const [slug] = useState("senpay");
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
    problem_statement: "",
    solution_statement: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
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
            problem_statement: data.problem_statement || "",
            solution_statement: data.solution_statement || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(API.dashboard.profile(slug), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage("Profil mis à jour avec succès ! Le cache public a été purgé.");
      } else {
        setMessage("Une erreur est survenue lors de la mise à jour.");
      }
    } catch (err) {
      setMessage("Erreur de connexion avec le serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen text-slate-500">
        Chargement des données du profil...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[720px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Édition du Profil</h1>
        <p className="text-sm text-slate-500 mt-1">
          Mettez à jour les informations publiques de votre startup.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-semibold mb-6 ${
          message.includes("succès") 
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Ligne 1 : Nom et Étape */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nom de la startup
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Stade de financement
            </label>
            <input
              type="text"
              value={form.funding_stage}
              onChange={(e) => setForm({ ...form, funding_stage: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
            />
          </div>
        </div>

        {/* Ligne 2 : Ville et Site Web */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Ville & Pays
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Site web (URL)
            </label>
            <input
              type="text"
              value={form.website_url}
              onChange={(e) => setForm({ ...form, website_url: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
            />
          </div>
        </div>

        {/* Description Courte */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Description courte (en 1 phrase)
          </label>
          <input
            type="text"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
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
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none"
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
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none"
            />
          </div>
        </div>

        {/* Réseaux Sociaux */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Twitter / X (URL)
            </label>
            <input
              type="text"
              value={form.twitter_url}
              onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              LinkedIn (URL)
            </label>
            <input
              type="text"
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all disabled:opacity-70 disabled:cursor-wait"
        >
          {submitting ? "Enregistrement en cours..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
