"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  { label: "Bleu", hex: "#3545E6" },
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
  sub,
}: {
  icon: React.ReactNode;
  badge: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {badge}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-2">
          {label}
        </p>
        <p className="text-[22px] font-extrabold text-slate-900 leading-tight">
          {value}
          {sub && (
            <>
              <br />
              <span className="text-lg font-extrabold">{sub}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function ReplyModal({
  lead,
  onClose,
  onSend,
}: {
  lead: Lead | null;
  onClose: () => void;
  onSend: (email: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (!lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      onSend(lead.sender_email);
      onClose();
      setMessage("");
      setSending(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              Répondre à {lead.sender_name}
            </p>
            <p className="text-xs text-slate-400">{lead.sender_entity}</p>
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
            placeholder={`Bonjour ${lead.sender_name.split(" ")[0]},\n\nMerci pour votre intérêt...`}
            className="w-full border border-slate-200 bg-slate-50/60 px-4 py-3 rounded-xl text-sm text-slate-700 outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none transition-all placeholder:text-slate-400"
          />
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
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [colorLabel, setColorLabel] = useState("Indigo");
  const [editingColor, setEditingColor] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [replyLead, setReplyLead] = useState<Lead | null>(null);
  const [slug] = useState("senpay");

  const [stats, setStats] = useState({
    profile_views: 0,
    contact_requests: 0,
    is_live: false,
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real dynamic data from Backend
  async function loadDashboardData() {
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

      // 2. Fetch stats
      const statsRes = await fetch(API.dashboard.stats(slug));
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 3. Fetch leads list
      const leadsRes = await fetch(API.dashboard.leads(slug));
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
    setEditingColor(false);

    try {
      const res = await fetch(API.dashboard.profile(slug), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primary_color: primaryColor }),
      });
      if (res.ok) {
        showToast("Profil mis à jour avec succès. Le cache public a été purgé.");
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
      <div className="flex items-start justify-between gap-4 mb-9">
        <div>
          <h1 className="text-2xl md:text-[28px] font-extrabold text-slate-900 flex items-center gap-2 leading-tight">
            Bonjour, Équipe SenPay <span>👋</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1.5">
            Voici un aperçu des performances de votre startup ce mois-ci.
          </p>
        </div>
        <button 
          onClick={() => showToast("Cette fonctionnalité de mise à jour sera bientôt disponible !")}
          className="flex items-center gap-2 bg-brand-active hover:bg-brand-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap"
        >
          + Nouvelle Mise à Jour
        </button>
      </div>

      {/* ─── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5 mb-7">
        <StatCard
          icon={<span className="text-brand-active text-lg">&#128065;</span>}
          badge={
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span>&#8593;</span>
              <span>+12%</span>
            </div>
          }
          label="Vues du profil"
          value={`${stats.profile_views} visites ce`}
          sub="mois-ci"
        />
        <StatCard
          icon={<span className="text-violet-500 text-lg">&#128101;</span>}
          badge={
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              Temps Réel
            </span>
          }
          label="Demandes de contact"
          value={`${stats.contact_requests} investisseurs`}
          sub="intéressés"
        />
        <StatCard
          icon={<span className="text-emerald-500 text-lg">&#10003;</span>}
          badge={
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                Live
              </span>
            </div>
          }
          label="Statut du profil"
          value={stats.is_live ? "En ligne / Public" : "Hors ligne"}
        />
      </div>

      {/* ─── Opportunities Table ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-[15px]">
            Aperçu de vos opportunités
          </h2>
          <Link 
            href="/dashboard/messages"
            className="text-xs font-bold text-brand-active hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            Voir tout &rsaquo;
          </Link>
        </div>

        {leads.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Aucune opportunité reçue pour le moment.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                {["NOM / FONDS", "ENTITÉ", "DATE", "ACTIONS"].map((h, i) => (
                  <th
                    key={h}
                    className={`text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] py-3 ${
                      i === 0 ? "text-left pl-6" : i === 3 ? "text-right pr-6" : "text-left px-4"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 3).map((lead, idx) => (
                <tr
                  key={lead.id}
                  className={`hover:bg-slate-50/60 transition-colors ${
                    idx !== leads.length - 1 ? "border-b border-slate-50" : ""
                  }`}
                >
                  {/* Name */}
                  <td className="pl-6 pr-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 bg-brand-50 text-brand-active">
                        {lead.sender_name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">
                        {lead.sender_name}
                      </span>
                    </div>
                  </td>
                  {/* Entity */}
                  <td className="px-4 py-4 text-slate-500">{lead.sender_entity}</td>
                  {/* Date */}
                  <td className="px-4 py-4 text-slate-400 text-xs font-medium">
                    {new Date(lead.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  {/* Action */}
                  <td className="pr-6 py-4 text-right">
                    <button
                      onClick={() => setReplyLead(lead)}
                      className="text-xs font-bold text-brand-active bg-brand-50 hover:bg-brand-100 border border-brand-100 px-4 py-2 rounded-lg transition-all"
                    >
                      Répondre
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── Bottom Row: Branding + Fundraising ───────────────────────── */}
      <div className="grid grid-cols-2 gap-6">
        {/* Branding Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4">
            Branding Startup
          </p>

          {/* Color row */}
          <div className="border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full border-2 border-white shadow-md shrink-0 transition-colors duration-200"
                style={{ backgroundColor: primaryColor }}
              />
              <div>
                <p className="text-[13px] font-bold text-slate-700 leading-tight">
                  Couleur
                </p>
                <p className="text-[12px] text-slate-400 leading-tight">
                  {colorLabel}
                </p>
              </div>
            </div>

            {editingColor ? (
              <div className="flex items-center gap-2">
                {/* Native color picker */}
                <div className="relative w-8 h-8">
                  <div
                    className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
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
                  className="text-xs font-bold text-white bg-brand-active hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-all"
                >
                  Sauvegarder
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
            <div className="flex flex-wrap gap-2 mb-4">
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

          <p className="text-xs text-slate-400 leading-relaxed">
            Cette couleur est utilisée sur votre page profil publique pour les
            boutons et accents.
          </p>
        </div>

        {/* Fundraising Banner */}
        <div
          className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[220px]"
          style={{ backgroundColor: "#3545E6" }}
        >
          {/* Glow blobs */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

          {/* Rocket decoration */}
          <div className="absolute right-5 bottom-5 opacity-10 text-7xl select-none pointer-events-none">
            &#128640;
          </div>

          <div className="relative z-10 space-y-2">
            <h3 className="text-[18px] font-extrabold text-white leading-snug">
              Prêt pour votre<br />prochaine levée ?
            </h3>
            <p className="text-xs text-white/70 font-medium leading-relaxed max-w-[200px]">
              Optimisez votre pitch deck avec nos experts partenaires
              spécialisés dans l'écosystème sahélien.
            </p>
          </div>

          <button 
            onClick={() => showToast("Redirection vers les services de pitch-deck partenaire...")}
            className="mt-5 w-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm text-white text-xs font-bold py-3 rounded-xl transition-all relative z-10"
          >
            Découvrir les services
          </button>
        </div>
      </div>

      {/* ─── Reply Modal ──────────────────────────────────────────────── */}
      <ReplyModal
        lead={replyLead}
        onClose={() => setReplyLead(null)}
        onSend={handleReplySent}
      />
    </div>
  );
}
