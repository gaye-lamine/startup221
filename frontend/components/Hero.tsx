import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: () => void;
  onSelectPopular: (tag: string) => void;
}

export default function Hero({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onSelectPopular,
}: HeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Command + K or Control + K to focus search shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF2FF]/40 via-white to-transparent pt-16 pb-12 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4">
          Découvrez et investissez dans la <br />
          <span className="text-brand-active">Tech au Sénégal</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
          La plateforme centrale connectant les startups les plus innovantes du
          Sénégal avec les investisseurs et partenaires stratégiques du monde entier.
        </p>

        {/* Search Bar Input Container */}
        <div className="max-w-2xl mx-auto relative flex items-center bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-1.5 shadow-[0_4px_20px_rgba(53,69,230,0.04)] focus-within:ring-2 focus-within:ring-brand-active/20 focus-within:border-brand-active transition-all duration-200">
          <div className="flex items-center pl-3 flex-grow gap-2">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher une startup, une solution, un secteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full text-sm outline-none text-slate-700 bg-transparent placeholder-slate-400"
            />
          </div>

          {/* Key Combination Indicator */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-200 px-2 py-1 rounded-md mr-2 select-none">
            CMD + K
          </div>

          {/* Search Button */}
          <button
            onClick={onSearchSubmit}
            className="bg-brand-active hover:bg-brand-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm shrink-0"
          >
            Rechercher
          </button>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider">
            Populaire :
          </span>
          {["Fintech", "AgriTech", "Logistique"].map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectPopular(tag)}
              className="bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-active font-semibold px-3 py-1.5 rounded-full transition-colors border border-slate-200/50"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
