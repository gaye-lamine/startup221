import React from "react";

interface SidebarFiltersProps {
  selectedSectors: string[];
  toggleSector: (sector: string) => void;
  selectedNeeds: string[];
  toggleNeed: (need: string) => void;
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  resetAll: () => void;
}

export default function SidebarFilters({
  selectedSectors,
  toggleSector,
  selectedNeeds,
  toggleNeed,
  selectedSizes,
  toggleSize,
  resetAll,
}: SidebarFiltersProps) {
  const sectors = ["Fintech", "HealthTech", "AgriTech", "EdTech", "Logistique"];
  const needs = [
    { label: "Cherche Investisseurs", value: "Investisseurs" },
    { label: "Cherche Partenaires", value: "Partenaires" },
    { label: "Recrutement", value: "Recrutement" },
  ];
  const sizes = [
    { label: "1-10 personnes", value: "1-10" },
    { label: "11-50 personnes", value: "11-50" },
    { label: "51+ personnes", value: "51+" },
  ];

  const hasActiveFilters =
    selectedSectors.length > 0 ||
    selectedNeeds.length > 0 ||
    selectedSizes.length > 0;

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-8 bg-white md:bg-transparent p-5 md:p-0 rounded-xl md:rounded-none border md:border-none border-slate-100">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-800 text-base">Filtres de recherche</h2>
        {hasActiveFilters && (
          <button
            onClick={resetAll}
            className="text-xs font-semibold text-brand-active hover:underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Secteurs d'activité */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 pb-1 border-b border-slate-100">
          Secteurs d'activité
        </h3>
        <div className="space-y-3.5">
          {sectors.map((sector) => {
            const isChecked = selectedSectors.includes(sector);
            return (
              <label key={sector} className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSector(sector)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-active focus:ring-brand-active/20 accent-brand-active"
                />
                <span className={`text-sm transition-colors ${
                  isChecked ? "text-slate-900 font-semibold" : "text-slate-600 group-hover:text-slate-900"
                }`}>
                  {sector}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Étape / Besoin */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 pb-1 border-b border-slate-100">
          Étape / Besoin
        </h3>
        <div className="flex flex-wrap gap-2">
          {needs.map((need) => {
            const isActive = selectedNeeds.includes(need.value);
            return (
              <button
                key={need.value}
                onClick={() => toggleNeed(need.value)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                  isActive
                    ? "bg-brand-active border-brand-active text-white shadow-sm"
                    : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 hover:border-slate-200"
                }`}
              >
                {need.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Taille de l'équipe */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 pb-1 border-b border-slate-100">
          Taille de l'équipe
        </h3>
        <div className="space-y-3.5">
          {sizes.map((size) => {
            const isChecked = selectedSizes.includes(size.value);
            return (
              <label key={size.value} className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleSize(size.value)}
                  className="w-4 h-4 rounded-full border-slate-300 text-brand-active focus:ring-brand-active/20 accent-brand-active"
                />
                <span className={`text-sm transition-colors ${
                  isChecked ? "text-slate-900 font-semibold" : "text-slate-600 group-hover:text-slate-900"
                }`}>
                  {size.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
