"use client";

import React, { useState, useEffect } from "react";
import { API } from "../../../lib/api";

interface Lead {
  id: string;
  sender_name: string;
  sender_entity: string;
  sender_email: string;
  message_type: string;
  created_at: string;
}

export default function MessagesPage() {
  const [slug] = useState("senpay");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Lead | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function loadLeads() {
    try {
      const res = await fetch(API.dashboard.leads(slug));
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
    if (!replyText.trim() || !replyingTo) return;
    setSending(true);

    // Simulate messaging sending success
    setTimeout(() => {
      setToast(`Réponse envoyée à ${replyingTo.sender_email} !`);
      setReplyingTo(null);
      setReplyText("");
      setSending(false);
      setTimeout(() => setToast(null), 4000);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen text-slate-500">
        Chargement de votre boîte de réception...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[800px] mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
          <span className="text-emerald-500 font-bold">✓</span>
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Demandes de Contact & Leads</h1>
        <p className="text-sm text-slate-500 mt-1">
          Retrouvez les investisseurs intéressés par votre profil.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400">
          <p className="font-semibold text-lg">Aucun message pour l'instant</p>
          <p className="text-sm mt-1 text-slate-400">
            Les demandes de contact des investisseurs apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-active font-bold text-sm flex items-center justify-center">
                    {lead.sender_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{lead.sender_name}</h3>
                    <p className="text-xs text-slate-400">
                      {lead.sender_entity} &middot; {lead.sender_email}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="bg-brand-50 border border-brand-100 text-brand-active text-xs font-semibold px-2.5 py-1 rounded-md">
                    {lead.message_type}
                  </span>
                  <span className="text-xs text-slate-400 ml-3">
                    Reçu le {new Date(lead.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setReplyingTo(lead)}
                className="bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
              >
                Répondre
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">
                  Répondre à {replyingTo.sender_name}
                </p>
                <p className="text-xs text-slate-400">{replyingTo.sender_email}</p>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleReplySubmit} className="p-6 space-y-4">
              <textarea
                required
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Votre message..."
                className="w-full border border-slate-200 bg-slate-50/60 px-4 py-3 rounded-xl text-sm text-slate-700 outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm"
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
