"use client";

import React, { useState, useEffect, useCallback } from "react";
import { API } from "../lib/api";
import StartupCard, { Startup } from "../components/startup/StartupCard";

export default function DirectoryPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Filtering States
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Toggle helpers
  const handleSectorToggle = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
    setPage(1);
  };

  const handleNeedToggle = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
    setPage(1);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedSectors([]);
    setSelectedNeeds([]);
    setSelectedSizes([]);
    setSearchQuery("");
    setSearchSubmitted("");
    setPage(1);
  };

  // Fetch directory data dynamically from the API backend
  const fetchStartups = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "9");

      if (searchSubmitted) {
        params.append("search", searchSubmitted);
      }

      selectedSectors.forEach((sec) => params.append("sector", sec));
      selectedNeeds.forEach((nd) => params.append("seeking", nd));

      // Calculate employee ranges for min_employees/max_employees parameters
      let minEmp: number | null = null;
      let maxEmp: number | null = null;
      if (selectedSizes.length > 0) {
        selectedSizes.forEach((size) => {
          if (size === "1-10") {
            if (minEmp === null || minEmp > 1) minEmp = 1;
            if (maxEmp === null || maxEmp < 10) maxEmp = 10;
          } else if (size === "11-50") {
            if (minEmp === null || minEmp > 11) minEmp = 11;
            if (maxEmp === null || maxEmp < 50) maxEmp = 50;
          } else if (size === "51+") {
            if (minEmp === null || minEmp > 51) minEmp = 51;
            // No upper limit set for maxEmp
          }
        });
      }

      if (minEmp !== null) params.append("min_employees", minEmp.toString());
      if (maxEmp !== null) params.append("max_employees", maxEmp.toString());

      const res = await fetch(`${API.startups.list}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        // Perform sorting execution in frontend after fetch
        let items: Startup[] = data.items;
        if (sortBy === "recent") {
          // Default: recent is ordered by backend
        } else if (sortBy === "alpha") {
          items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "size") {
          items = [...items].sort((a, b) => b.employee_count - a.employee_count);
        }

        setStartups(items);
        setTotalCount(data.total);
        setTotalPages(data.total_pages);
      }
    } catch (err) {
      console.error("Error fetching startups", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchSubmitted, selectedSectors, selectedNeeds, selectedSizes, sortBy]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  // Execute search queries
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchSubmitted(searchQuery);
    setPage(1);
  };

  const handlePopularShortcut = (tag: string) => {
    setSearchQuery(tag);
    setSearchSubmitted(tag);
    setPage(1);
  };

  return (
    <div className="pb-20 bg-slate-50/50 min-h-screen">
      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/40 via-white to-transparent pt-16 pb-12 text-center border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
            Le point de rencontre de la <br />
            <span className="text-brand-active">Tech sénégalaise</span>
          </h1>

          <p className="text-base text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            StartupSN recense, connecte et valorise les startups les plus prometteuses du Sénégal. Un seul endroit pour découvrir l'écosystème, lever des fonds, recruter et nouer des partenariats.
          </p>

          {/* Search bar wrapper */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative flex items-center bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-1.5 shadow-[0_4px_20px_rgba(53,69,230,0.04)] focus-within:ring-2 focus-within:ring-brand-active/20 focus-within:border-brand-active transition-all duration-200">
            <div className="flex items-center pl-3 flex-grow gap-2">
              <span className="text-slate-400 text-base shrink-0">&#128269;</span>
              <input
                type="text"
                placeholder="Rechercher une startup, une solution, un secteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-slate-700 bg-transparent placeholder-slate-400"
              />
            </div>
            
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md mr-2 select-none">
              CMD + K
            </div>

            <button
              type="submit"
              className="bg-brand-active hover:bg-brand-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm shrink-0"
            >
              Rechercher
            </button>
          </form>

          {/* Popular Tag Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider">
              Populaire :
            </span>
            {["Fintech", "AgriTech", "Logistique"].map((tag) => (
              <button
                key={tag}
                onClick={() => handlePopularShortcut(tag)}
                className="bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-active font-semibold px-3 py-1.5 rounded-full transition-colors border border-slate-200/50"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── METRICS BANNER ─────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-8 mb-12 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center gap-6 md:gap-0">
            <div className="md:px-4 py-2 md:py-0">
              <span className="block text-3xl font-extrabold text-brand-active mb-1">+150</span>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                Startups Référencées
              </span>
            </div>
            <div className="md:px-4 py-2 md:py-0">
              <span className="block text-3xl font-extrabold text-emerald-600 mb-1">12 Milliards FCFA</span>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                Levés via le réseau
              </span>
            </div>
            <div className="md:px-4 py-2 md:py-0">
              <span className="block text-3xl font-extrabold text-brand-active mb-1">+50</span>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                Investisseurs Actifs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DUAL COLUMN INTERFACE ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-8">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-base">Filtres</h2>
              {(selectedSectors.length > 0 || selectedNeeds.length > 0 || selectedSizes.length > 0 || searchSubmitted) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-brand-active hover:underline"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Secteurs d'activité */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 pb-1 border-b border-slate-100">
                Secteur d'activité
              </h3>
              <div className="space-y-3">
                {["Fintech", "HealthTech", "AgriTech", "EdTech", "Logistique"].map((sector) => {
                  const active = selectedSectors.includes(sector);
                  return (
                    <label key={sector} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => handleSectorToggle(sector)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-active focus:ring-brand-active/20 accent-brand-active"
                      />
                      <span className={`text-sm transition-colors ${
                        active ? "text-slate-900 font-semibold" : "text-slate-500 group-hover:text-slate-800"
                      }`}>
                        {sector}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Besoins (seeking) */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4 pb-1 border-b border-slate-100">
                Étape / Besoin
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Investisseurs", val: "Investisseurs" },
                  { label: "Partenaires", val: "Partenaires" },
                  { label: "Recrutement", val: "Recrutement" },
                ].map((need) => {
                  const active = selectedNeeds.includes(need.val);
                  return (
                    <button
                      key={need.val}
                      onClick={() => handleNeedToggle(need.val)}
                      className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                        active
                          ? "bg-brand-active border-brand-active text-white"
                          : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
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
                Collaborateurs
              </h3>
              <div className="space-y-3">
                {[
                  { label: "1-10 personnes", val: "1-10" },
                  { label: "11-50 personnes", val: "11-50" },
                  { label: "51+ personnes", val: "51+" },
                ].map((size) => {
                  const active = selectedSizes.includes(size.val);
                  return (
                    <label key={size.val} className="flex items-center gap-3 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => handleSizeToggle(size.val)}
                        className="w-4 h-4 rounded border-slate-300 text-brand-active focus:ring-brand-active/20 accent-brand-active"
                      />
                      <span className={`text-sm transition-colors ${
                        active ? "text-slate-900 font-semibold" : "text-slate-500 group-hover:text-slate-800"
                      }`}>
                        {size.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Grid and Sorting */}
          <main className="flex-grow w-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {totalCount} {totalCount > 1 ? "startups trouvées" : "startup trouvée"}
              </h2>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-brand-active"
                >
                  <option value="recent">Plus récents</option>
                  <option value="alpha">Nom (A-Z)</option>
                  <option value="size">Taille d'équipe</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-slate-400 font-semibold">
                Chargement des startups...
              </div>
            ) : startups.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
                <p className="font-bold text-lg">Aucune startup trouvée</p>
                <p className="text-sm mt-1">Essayez de réinitialiser vos filtres de recherche.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 bg-brand-active hover:bg-brand-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                >
                  Réinitialiser
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {startups.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &larr; Précédent
                </button>
                <span className="text-xs font-bold text-slate-500">
                  Page {page} sur {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant &rarr;
                </button>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}
