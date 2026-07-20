"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API } from "../../lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  sender_name: string;
  sender_entity: string;
  sender_email: string;
  message_type: string;
  created_at: string;
}

const PALETTE_PRESETS = [
  { label: "Indigo", hex: "#4f46e5" },
  { label: "Vert SN", hex: "#0C8A4D" },
  { label: "Violet", hex: "#7c3aed" },
  { label: "Émeraude", hex: "#059669" },
  { label: "Rose", hex: "#e11d48" },
  { label: "Ambre", hex: "#d97706" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  badge,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  badge?: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[150px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
            {icon}
          </div>
          {badge}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1 leading-none">
          {value}
        </p>
      </div>
      <p className="text-xs text-slate-400 font-medium mt-3">
        {description}
      </p>
    </div>
  );
}

function ReplyModal({
  lead,
  slug,
  onClose,
  onSend,
}: {
  lead: Lead | null;
  slug: string | null;
  onClose: () => void;
  onSend: (email: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!lead) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !slug) return;
    setSending(true);
    setError(null);
    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.replyLead(slug, lead.id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      onSend(lead.sender_email || "");
      onClose();
      setMessage("");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  };

  const senderFirstName = (lead.sender_name || "Investisseur").split(" ")[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              Répondre à {lead.sender_name || "Investisseur"}
            </p>
            <p className="text-xs text-slate-400">{lead.sender_entity || "Fonds / Organisation"}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none font-bold"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <textarea
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Bonjour ${senderFirstName},\n\nMerci pour votre intérêt...`}
            className="w-full border border-slate-200 bg-slate-50/60 px-4 py-3 rounded-xl text-sm text-slate-700 outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none transition-all placeholder:text-slate-400"
          />
          {error && (
            <p className="text-xs text-red-600 font-semibold">{error}</p>
          )}
          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 bg-brand-active hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm disabled:opacity-75"
          >
            {sending ? "Envoi..." : "Envoyer la réponse"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [colorLabel, setColorLabel] = useState("Indigo");
  const [editingColor, setEditingColor] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [replyLead, setReplyLead] = useState<Lead | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [startupName, setStartupName] = useState("Ma Startup");

  const [stats, setStats] = useState({
    profile_views: 0,
    contact_requests: 0,
    is_live: false,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication check and dynamic slug retrieval
  useEffect(() => {
    const session = localStorage.getItem("startup_session");
    const storedSlug = localStorage.getItem("startup_slug");
    const storedName = localStorage.getItem("startup_name");
    
    if (session !== "true" || !storedSlug) {
      router.push("/"); // Redirect guest to home directory
    } else {
      setSlug(storedSlug);
      if (storedName) setStartupName(storedName);
    }
  }, [router]);

  // Load real dynamic data from Backend
  async function loadDashboardData() {
    if (!slug) return;
    try {
      // 1. Fetch startup profile (to get primary color)
      const profileRes = await fetch(API.startups.bySlug(slug));
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile.primary_color) {
          setPrimaryColor(profile.primary_color);
          const matchedPreset = PALETTE_PRESETS.find(
            (p) => p.hex.toLowerCase() === profile.primary_color.toLowerCase()
          );
          setColorLabel(matchedPreset ? matchedPreset.label : profile.primary_color);
        }
      }

      const token = localStorage.getItem("startup_token");
      const headers: HeadersInit = token ? { "Authorization": `Bearer ${token}` } : {};

      // 2. Fetch stats
      const statsRes = await fetch(API.dashboard.stats(slug), { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 3. Fetch leads list
      const leadsRes = await fetch(API.dashboard.leads(slug), { headers });
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData);
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [slug]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleColorSave = async () => {
    if (!slug) return;
    setEditingColor(false);

    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.profile(slug), {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ primary_color: primaryColor }),
      });
      if (res.ok) {
        showToast("Couleur de marque mise à jour avec succès !");
      } else {
        showToast("Erreur lors de la mise à jour.");
      }
    } catch {
      showToast("Erreur de connexion.");
    }
  };

  const handleReplySent = (email: string) => {
    showToast(`Réponse envoyée avec succès à ${email} !`);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen text-slate-500 font-semibold">
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[860px] mx-auto relative">
      {/* ─── Toast ────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 text-white text-xs font-bold">
            ✓
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-1 text-slate-400 hover:text-white transition-colors text-lg leading-none font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
            Bonjour, {startupName}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Voici un aperçu des performances de votre startup ce mois-ci.
          </p>
        </div>
        <button 
          onClick={() => router.push("/dashboard/profile")}
          className="flex items-center justify-center gap-2 bg-brand-active hover:bg-brand-600 text-white text-sm font-bold px-5 py-3.5 rounded-xl transition-all shadow-md shadow-brand-active/10 shrink-0 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Mettre à jour le profil
        </button>
      </div>

      {/* ─── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={
            <svg className="w-5 h-5 text-brand-active" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          badge={
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/60 px-2.5 py-0.5 rounded-full">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              <span>+12%</span>
            </div>
          }
          label="Vues du profil"
          value={stats?.profile_views ?? 0}
          description="Visites uniques ce mois-ci"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742h.008v.008h-.008v-.008zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
          badge={
            <span className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              En direct
            </span>
          }
          label="Demandes de contact"
          value={stats?.contact_requests ?? 0}
          description="Investisseurs intéressés"
        />

        <StatCard
          icon={
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          badge={
            <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100/60 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                Public
              </span>
            </div>
          }
          label="Statut du profil"
          value={stats?.is_live ? "En ligne" : "Hors ligne"}
          description="Visibilité dans l'annuaire"
        />
      </div>

      {/* ─── Opportunities Table ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-8 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100/60">
          <h2 className="font-extrabold text-brand-dark text-base">
            Dernières demandes reçues
          </h2>
          <Link 
            href="/dashboard/messages"
            className="text-xs font-bold text-brand-active hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            Voir tous les messages &rarr;
          </Link>
        </div>

        {!leads || leads.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400 font-medium">
            Aucune opportunité de contact reçue pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/50">
                  {["NOM / FONDS", "ENTITÉ / ORGANISATION", "DATE D'ENVOI", "ACTIONS"].map((h, i) => (
                    <th
                      key={h}
                      className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest py-3.5 ${
                        i === 0 ? "text-left pl-6" : i === 3 ? "text-right pr-6" : "text-left px-4"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads?.slice(0, 3).map((lead) => {
                  const senderName = lead.sender_name || "Investisseur Anonyme";
                  const senderInitials = senderName.slice(0, 2).toUpperCase();
                  const senderEntity = lead.sender_entity || "Fonds Privé";
                  const dateStr = lead.created_at ? new Date(lead.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }) : "--";

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="pl-6 pr-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 bg-brand-50 text-brand-active border border-brand-100">
                            {senderInitials}
                          </div>
                          <span className="font-bold text-slate-800">
                            {senderName}
                          </span>
                        </div>
                      </td>
                      {/* Entity */}
                      <td className="px-4 py-4 text-slate-600 font-medium">{senderEntity}</td>
                      {/* Date */}
                      <td className="px-4 py-4 text-slate-400 text-xs font-semibold">
                        {dateStr}
                      </td>
                      {/* Action */}
                      <td className="pr-6 py-4 text-right">
                        <button
                          onClick={() => setReplyLead(lead)}
                          className="text-xs font-bold text-brand-active hover:text-white bg-brand-50 hover:bg-brand-active border border-brand-100 hover:border-brand-active px-4 py-2 rounded-xl transition-all"
                        >
                          Répondre
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Bottom Row: Branding + Fundraising ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branding Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] p-6 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Identité visuelle
            </p>

            {/* Color row */}
            <div className="border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-3 mb-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full border-2 border-white shadow-md shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: primaryColor }}
                />
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">
                    Couleur principale
                  </p>
                  <p className="text-[11px] text-slate-400 font-bold tracking-wider leading-tight mt-1">
                    {colorLabel}
                  </p>
                </div>
              </div>

              {editingColor ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8">
                    <div
                      className="w-8 h-8 rounded-xl border border-slate-200 cursor-pointer shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        setColorLabel(e.target.value.toUpperCase());
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                  <button
                    onClick={handleColorSave}
                    className="text-xs font-bold text-white bg-brand-active hover:bg-brand-600 px-3 py-2 rounded-xl transition-all shadow-sm shadow-brand-active/10"
                  >
                    Enregistrer
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingColor(true)}
                  className="text-xs font-bold text-brand-active hover:text-brand-600 transition-colors"
                >
                  Modifier
                </button>
              )}
            </div>

            {/* Palette presets */}
            {editingColor && (
              <div className="flex flex-wrap gap-2.5 mb-4 animate-fadeIn">
                {PALETTE_PRESETS.map((p) => (
                  <button
                    key={p.hex}
                    title={p.label}
                    onClick={() => {
                      setPrimaryColor(p.hex);
                      setColorLabel(p.label);
                    }}
                    className="w-6 h-6 rounded-full border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: p.hex,
                      borderColor:
                        primaryColor === p.hex ? "white" : "transparent",
                      boxShadow:
                        primaryColor === p.hex
                          ? `0 0 0 2px ${p.hex}`
                          : "none",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2">
            Cette couleur est appliquée sur vos boutons, liens et accents de votre page profil publique.
          </p>
        </div>

        {/* Fundraising Banner */}
        <div
          className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[220px]"
          style={{ backgroundColor: "#0C8A4D" }}
        >
          {/* Glow blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-extrabold text-white leading-snug">
              Recherche de fonds
            </h3>
            <p className="text-xs text-white/80 font-medium leading-relaxed max-w-[220px]">
              Définissez votre besoin de financement pour apparaître instantanément dans le flux des investisseurs.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/profile")}
            className="mt-6 w-full bg-white text-emerald-800 hover:bg-slate-50 font-bold text-xs py-3 rounded-xl transition-all relative z-10 shadow-sm"
          >
            Modifier mes besoins de financement &rarr;
          </button>
        </div>
      </div>

      {/* ─── Reply Modal ──────────────────────────────────────────────── */}
      <ReplyModal
        lead={replyLead}
        slug={slug}
        onClose={() => setReplyLead(null)}
        onSend={handleReplySent}
      />
    </div>
  );
}

