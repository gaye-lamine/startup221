"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-[600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gérez vos préférences de compte et de notification.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl text-sm font-semibold mb-6 bg-emerald-50 text-emerald-700 border border-emerald-100">
          Paramètres enregistrés avec succès !
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Toggle notifications */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Alertes Emails</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recevoir un email instantané lorsqu'un investisseur laisse un message.
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
            className="w-5 h-5 rounded accent-brand-active cursor-pointer"
          />
        </div>

        {/* Toggle API Access */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Clés API</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Activer l'accès programmatique externe à vos données d'annuaire.
            </p>
          </div>
          <input
            type="checkbox"
            checked={apiAccess}
            onChange={() => setApiAccess(!apiAccess)}
            className="w-5 h-5 rounded accent-brand-active cursor-pointer"
          />
        </div>

        {/* Static Info Zone */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Zone de danger
          </h3>
          <button className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-4 py-2.5 rounded-xl border border-red-100 transition-all">
            Désactiver le compte startup
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all"
        >
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  );
}
