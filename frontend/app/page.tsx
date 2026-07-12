"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Hero from "../components/Hero";
import SidebarFilters from "../components/SidebarFilters";
import StartupCard, { Startup } from "../components/StartupCard";
import { API } from "../lib/api";

// Mock Fallback Data matching screen.png mockup
const MOCK_STARTUPS: Startup[] = [
  {
    id: "1",
    name: "SenPay",
    slug: "senpay",
    logo_url: "",
    sector: "Fintech",
    employee_count: 18,
    description: "La révolution du paiement mobile inter-opérable pour l'Afrique de l'Ouest. Transférez et payez instantanément avec sécurité accrue.",
    seeking: ["Investisseurs"],
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "SunuField",
    slug: "sunufield",
    logo_url: "",
    sector: "AgriTech",
    employee_count: 8,
    description: "Optimisation des récoltes par intelligence artificielle pour les coopératives agricoles locales. Augmentez vos rendements de 30%.",
    seeking: ["Partenaires"],
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "FastLivr",
    slug: "fastlivr",
    logo_url: "",
    sector: "Logistique",
    employee_count: 48,
    description: "Dernier kilomètre automatisé pour le e-commerce et la livraison rapide à Dakar. Suivi précis en temps réel et planification intelligente.",
    seeking: ["Série A"],
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "SanteConnect",
    slug: "santeconnect",
    logo_url: "",
    sector: "HealthTech",
    employee_count: 22,
    description: "Dossier médical partagé et téléconsultation sécurisée pour désengorger les hôpitaux et accélérer les diagnostics en milieu rural.",
    seeking: ["Recrutement"],
    created_at: new Date().toISOString(),
  },
];

export default function DirectoryPage() {
  // Query & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState("");
  
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("recent");
  
  // Pagination & Data States
  const [page, setPage] = useState(1);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Toggle helpers
  const toggleSector = (sector: string) => {
    setSelectedSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
    setPage(1);
  };

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
    setPage(1);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setPage(1);
  };

  const handleSelectPopular = (tag: string) => {
    setSearchQuery(tag);
    setSearchSubmitted(tag);
    setPage(1);
  };

  const handleSearchSubmit = () => {
    setSearchSubmitted(searchQuery);
    setPage(1);
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSearchSubmitted("");
    setSelectedSectors([]);
    setSelectedNeeds([]);
    setSelectedSizes([]);
    setPage(1);
  };

  // Asynchronous Fetch logic connecting to FastAPI backend
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
      selectedSizes.forEach((sz) => params.append("size", sz));
      selectedNeeds.forEach((nd) => params.append("seeking", nd));

      const response = await fetch(
        `${API.startups.list}?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error("API request failed");
      }
      
      const data = await response.json();
      setStartups(data.items);
      setTotalCount(data.total);
      setTotalPages(data.total_pages);
      setIsUsingMock(false);
    } catch (error) {
      console.warn("FastAPI backend is currently offline. Falling back to frontend mock data.");
      
      // Perform frontend filtration on fallback data
      let filtered = [...MOCK_STARTUPS];

      if (searchSubmitted) {
        const query = searchSubmitted.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.sector.toLowerCase().includes(query)
        );
      }

      if (selectedSectors.length > 0) {
        filtered = filtered.filter((s) => selectedSectors.includes(s.sector));
      }

      if (selectedNeeds.length > 0) {
        filtered = filtered.filter((s) =>
          s.seeking.some((need) => selectedNeeds.includes(need))
        );
      }

      if (selectedSizes.length > 0) {
        filtered = filtered.filter((s) => {
          if (s.employee_count <= 10) return selectedSizes.includes("1-10");
          if (s.employee_count <= 50) return selectedSizes.includes("11-50");
          return selectedSizes.includes("51+");
        });
      }

      const limit = 9;
      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + limit);

      setStartups(paginated);
      setTotalCount(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / limit)));
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [page, searchSubmitted, selectedSectors, selectedNeeds, selectedSizes]);

  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

  return (
    <div className="pb-16">
      {/* Hero Header Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSelectPopular={handleSelectPopular}
      />

      {/* Network Stats Bar */}
      <section className="bg-white border-y border-slate-100 py-8 mb-12 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center gap-6 md:gap-0">
            <div className="md:px-4 py-2 md:py-0">
              <span className="block text-3xl font-extrabold text-brand-active mb-1">+150</span>
              <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                Startups Référencées
              </span>
            </div>
            <div className="md:px-4 py-2 md:py-0">
              <span className="block text-3xl font-extrabold text-emerald-600 mb-1">Millions FCFA</span>
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

      {/* Core Directory Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sub-header details */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>{totalCount} {totalCount > 1 ? "startups trouvées" : "startup trouvée"}</span>
              {isUsingMock && (
                <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-semibold border border-amber-100">
                  Mode Démo (Backend déconnecté)
                </span>
              )}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-700 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrer</span>
            </button>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                Trier par :
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 outline-none focus:border-brand-active"
              >
                <option value="recent">Plus récentes</option>
                <option value="name">Nom (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Two-Column Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar: Responsive layout */}
          <div className={`md:block ${mobileFiltersOpen ? "block" : "hidden"}`}>
            <SidebarFilters
              selectedSectors={selectedSectors}
              toggleSector={toggleSector}
              selectedNeeds={selectedNeeds}
              toggleNeed={toggleNeed}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              resetAll={resetAllFilters}
            />
          </div>

          {/* Cards Grid */}
          <div className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="bg-white border border-slate-100 rounded-xl p-5 h-[300px] animate-pulse flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="w-12 h-12 bg-slate-200 rounded-lg" />
                        <div className="w-16 h-5 bg-slate-200 rounded-full" />
                      </div>
                      <div className="w-2/3 h-5 bg-slate-200 rounded" />
                      <div className="w-full h-12 bg-slate-100 rounded" />
                    </div>
                    <div className="w-full h-10 bg-slate-200 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : startups.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-xl p-12 text-center max-w-lg mx-auto">
                <p className="text-slate-500 font-medium mb-4">
                  Aucune startup ne correspond à vos filtres actuels.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="bg-brand-active text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {startups.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} />
                ))}
              </div>
            )}

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === page;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? "bg-brand-active text-white shadow-sm"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
