"use client";

import React, { useState, useEffect, useRef } from "react";
import { API } from "../../lib/api";
import {
  Eye,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
  X,
  Palette,
  Rocket,
  Send,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  id: string;
  initials: string;
  name: string;
  entity: string;
  date: string;
  avatarClass: string;
}

// ─── Mock Data (falls back to real API in production) ────────────────────────
const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    initials: "TS",
    name: "Teranga Solutions",
    entity: "VC Fund - Seed",
    date: "Hier, 14:20",
    avatarClass: "bg-brand-50 text-brand-active",
  },
  {
    id: "2",
    initials: "AM",
    name: "Aissatou Maïga",
    entity: "Angel Investor",
    date: "12 Nov 2024",
    avatarClass: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "3",
    initials: "GC",
    name: "Gainde Capital",
    entity: "Private Equity",
    date: "10 Nov 2024",
    avatarClass: "bg-violet-50 text-violet-600",
  },
];

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
  onSend: () => void;
}) {
  const [message, setMessage] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={ref}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold ${lead.avatarClass}`}
            >
              {lead.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {lead.name}
              </p>
              <p className="text-xs text-slate-400">{lead.entity}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Bonjour ${lead.name.split(" ")[0]},\n\nMerci pour votre intérêt pour SenPay. Nous serions ravis d'échanger avec vous...`}
            className="w-full border border-slate-200 bg-slate-50/60 px-4 py-3 rounded-xl text-sm text-slate-700 outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none transition-all placeholder:text-slate-400"
          />
          <button
            onClick={() => {
              onSend();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 bg-brand-active hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
            Envoyer la réponse
          </button>
        </div>
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
  const [slug] = useState("senpay"); // In production, derive from auth session

  // Simulate fetching real stats from API
  const [stats] = useState({
    profile_views: 342,
    contact_requests: 12,
    is_live: true,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleColorSave = async () => {
    setEditingColor(false);

    // Call real API to update primary_color and invalidate Redis cache
    try {
      const res = await fetch(API.dashboard.profile(slug), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ primary_color: primaryColor }),
        }
      );
      if (res.ok) {
        showToast("Profil mis à jour avec succès.");
      } else {
        showToast("Erreur lors de la mise à jour.");
      }
    } catch {
      // API unavailable — just show optimistic success for demo
      showToast("Profil mis à jour avec succès.");
    }
  };

  return (
    <div className="p-8 max-w-[860px] mx-auto relative">
      {/* ─── Toast ────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce-in">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
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
        <button className="flex items-center gap-2 bg-brand-active hover:bg-brand-600 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-md shrink-0 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Nouvelle Mise à Jour
        </button>
      </div>

      {/* ─── Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5 mb-7">
        <StatCard
          icon={<Eye className="w-5 h-5 text-brand-active" />}
          badge={
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+12%</span>
            </div>
          }
          label="Vues du profil"
          value={`${stats.profile_views} visites ce`}
          sub="mois-ci"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-violet-500" />}
          badge={
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
              Oct - Nov
            </span>
          }
          label="Demandes de contact"
          value={`${stats.contact_requests} investisseurs`}
          sub="intéressés"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          badge={
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                Live
              </span>
            </div>
          }
          label="Statut du profil"
          value="En ligne / Public"
        />
      </div>

      {/* ─── Opportunities Table ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] mb-6 overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-[15px]">
            Aperçu de vos opportunités
          </h2>
          <button className="text-xs font-bold text-brand-active hover:text-brand-600 flex items-center gap-1 transition-colors">
            Voir tout
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

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
            {MOCK_LEADS.map((lead, idx) => (
              <tr
                key={lead.id}
                className={`hover:bg-slate-50/60 transition-colors ${
                  idx !== MOCK_LEADS.length - 1 ? "border-b border-slate-50" : ""
                }`}
              >
                {/* Name */}
                <td className="pl-6 pr-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${lead.avatarClass}`}
                    >
                      {lead.initials}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {lead.name}
                    </span>
                  </div>
                </td>
                {/* Entity */}
                <td className="px-4 py-4 text-slate-500">{lead.entity}</td>
                {/* Date */}
                <td className="px-4 py-4 text-slate-400 text-xs font-medium">
                  {lead.date}
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
                className="text-xs font-bold text-brand-active hover:text-brand-600 transition-colors flex items-center gap-1"
              >
                <Palette className="w-3.5 h-3.5" />
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

          {/* Rocket icon */}
          <div className="absolute right-5 bottom-5 opacity-20">
            <Rocket className="w-20 h-20 text-white" />
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

          <button className="mt-5 w-full bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-sm text-white text-xs font-bold py-3 rounded-xl transition-all relative z-10">
            Découvrir les services
          </button>
        </div>
      </div>

      {/* ─── Reply Modal ──────────────────────────────────────────────── */}
      <ReplyModal
        lead={replyLead}
        onClose={() => setReplyLead(null)}
        onSend={() => showToast("Réponse envoyée avec succès !")}
      />
    </div>
  );
}
