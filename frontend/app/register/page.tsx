"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Field States
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [mission, setMission] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [sector, setSector] = useState("Fintech");
  const [employeeCount, setEmployeeCount] = useState(5);

  // Media States
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop");
  const [primaryColor, setPrimaryColor] = useState("#3545E6");

  // Goals & Links States
  const [needs, setNeeds] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleNeed = (need: string) => {
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((item) => item !== need) : [...prev, need]
    );
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Le nom de la startup est requis";
    if (!city.trim()) newErrors.city = "La ville de localisation est requise";
    if (!mission.trim()) newErrors.mission = "La description de votre mission est requise";
    if (!problem.trim()) newErrors.problem = "Veuillez définir le problème";
    if (!solution.trim()) newErrors.solution = "Veuillez définir votre solution";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      name,
      slug: generateSlug(name) || "startup-" + Math.floor(Math.random() * 1000),
      logo_url: logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop",
      sector,
      employee_count: Number(employeeCount),
      description: mission,
      seeking: needs.length > 0 ? needs : ["Partenaires"],
      primary_color: primaryColor,
      funding_stage: "Amorçage / Seed",
      city,
      website_url: websiteUrl || "#",
      linkedin_url: linkedinUrl || "#",
      twitter_url: twitterUrl || "#",
      problem_statement: problem,
      solution_statement: solution,
    };

    try {
      const res = await fetch(API.startups.list, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          router.push("/");
        }, 2500);
      } else {
        const data = await res.json();
        setSubmitError(data.detail || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (err) {
      setSubmitError("Erreur de connexion avec le serveur.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Propulsez votre Startup
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Rejoignez l'écosystème entrepreneurial du Sénégal en quelques étapes.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative mb-12 flex justify-between items-center max-w-xl mx-auto">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute left-0 top-1/2 h-[2px] bg-brand-active -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            step >= 1 ? "bg-brand-active text-white" : "bg-slate-200 text-slate-600"
          }`}>
            1
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identité</span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            step >= 2 ? "bg-brand-active text-white" : "bg-slate-200 text-slate-600"
          }`}>
            2
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Médias</span>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            step >= 3 ? "bg-brand-active text-white" : "bg-slate-200 text-slate-600"
          }`}>
            3
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Objectifs</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 max-w-2xl mx-auto">
        {submitError && (
          <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm mb-6 font-semibold">
            {submitError}
          </div>
        )}

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 text-3xl rounded-full flex items-center justify-center mx-auto">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Enregistrement réussi !</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Votre startup a été insérée avec succès dans la base de données. Redirection vers l'annuaire...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* STEP 1: Identité */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Identité de l'entreprise</h3>
                  <p className="text-xs text-slate-400">Renseignez les informations de base de votre startup.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Nom de la Startup
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                      placeholder="Ex: SenPay"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Secteur d'activité
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 bg-white"
                    >
                      {["Fintech", "HealthTech", "AgriTech", "EdTech", "Logistique"].map((sec) => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Ville & Pays
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                      placeholder="Ex: Dakar, Sénégal"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Nombre d'employés
                    </label>
                    <input
                      type="number"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(Number(e.target.value))}
                      className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Mission (Description courte)
                  </label>
                  <input
                    type="text"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                    placeholder="La révolution du paiement mobile inter-opérable..."
                  />
                  {errors.mission && <p className="text-red-500 text-xs mt-1">{errors.mission}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Le Problème
                  </label>
                  <textarea
                    rows={2}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none"
                    placeholder="Quels sont les freins du marché ciblé ?"
                  />
                  {errors.problem && <p className="text-red-500 text-xs mt-1">{errors.problem}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Votre Solution
                  </label>
                  <textarea
                    rows={2}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50 resize-none"
                    placeholder="Comment votre produit résout ce problème ?"
                  />
                  {errors.solution && <p className="text-red-500 text-xs mt-1">{errors.solution}</p>}
                </div>
              </div>
            )}

            {/* STEP 2: Branding & Médias */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Branding & Médias</h3>
                  <p className="text-xs text-slate-400">Configurez l'apparence visuelle de votre startup.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    URL du Logo (Image)
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Couleur Primaire (HEX)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 border-0 rounded-lg cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="border border-slate-200 px-4 py-2 rounded-xl text-sm outline-none focus:border-brand-active w-32"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Objectifs & Réseaux */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Besoins & Liens</h3>
                  <p className="text-xs text-slate-400">Pourquoi rejoignez-vous la plateforme ?</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Quels sont vos besoins actuels ?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Investisseurs", "Partenaires", "Recrutement"].map((need) => {
                      const active = needs.includes(need);
                      return (
                        <button
                          type="button"
                          key={need}
                          onClick={() => toggleNeed(need)}
                          className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all ${
                            active
                              ? "bg-brand-active border-brand-active text-white"
                              : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {need}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Site Web
                    </label>
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Twitter / X
                    </label>
                    <input
                      type="text"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active focus:ring-2 focus:ring-brand-50"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  &larr; Retour
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-brand-active hover:bg-brand-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Continuer
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-active hover:bg-brand-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm disabled:opacity-70"
                >
                  {submitting ? "Traitement..." : "Finaliser l'inscription"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
