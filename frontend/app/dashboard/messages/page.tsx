"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API } from "../../../lib/api";

interface Lead {
  id: string;
  sender_name: string;
  sender_entity: string;
  sender_email: string;
  message_type: string;
  replied?: boolean;
  reply_message?: string;
  created_at: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Lead | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("startup_session");
    const storedSlug = localStorage.getItem("startup_slug");
    if (session !== "true" || !storedSlug) {
      router.push("/");
    } else {
      setSlug(storedSlug);
    }
  }, [router]);

  async function loadLeads() {
    if (!slug) return;
    try {
      const token = localStorage.getItem("startup_token");
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(API.dashboard.leads(slug), { headers });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (err) {
      console.error("Error loading leads", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [slug]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !replyingTo || !slug) return;
    setSending(true);
    setError(null);

    try {
      const token = localStorage.getItem("startup_token");
      const res = await fetch(API.dashboard.replyLead(slug, replyingTo.id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: replyText }),
      });

      if (res.ok) {
        setToast(`Réponse envoyée avec succès à ${replyingTo.sender_email} !`);
        setReplyingTo(null);
        setReplyText("");
        loadLeads(); // Reload leads to reflect replied status
        setTimeout(() => setToast(null), 4000);
      } else {
        setError("Erreur lors de l'enregistrement de la réponse.");
      }
    } catch (err) {
      setError("Erreur de connexion avec le serveur.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen text-slate-500 font-semibold">
        Chargement de votre boîte de réception...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[800px] mx-auto space-y-8">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-slide-up">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Demandes de Contact & Leads</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Retrouvez les investisseurs et partenaires intéressés par votre profil.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 font-medium">
          <p className="font-bold text-lg text-slate-700">Aucun message pour l&apos;instant</p>
          <p className="text-xs mt-1 text-slate-400">
            Les demandes de contact envoyées depuis votre fiche publique apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {lead.sender_name}
                    </h3>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-active border border-brand-100">
                      {lead.message_type || "Contact"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {lead.sender_entity} &bull; <span className="text-slate-400">{lead.sender_email}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(lead.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  {lead.replied ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      Répondu
                    </span>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(lead)}
                      className="bg-brand-active hover:bg-brand-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                    >
                      Répondre
                    </button>
                  )}
                </div>
              </div>

              {lead.replied && lead.reply_message && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Votre réponse envoyée :
                  </span>
                  <p className="text-slate-700 font-medium whitespace-pre-wrap">
                    {lead.reply_message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">
                Répondre à {replyingTo.sender_name}
              </h3>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Votre message de réponse
                </label>
                <textarea
                  rows={5}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Bonjour ${replyingTo.sender_name.split(" ")[0]},\n\nMerci de votre intérêt...`}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-brand-active resize-none"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 font-bold">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md disabled:opacity-70"
              >
                {sending ? "Envoi..." : "Envoyer la réponse"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
