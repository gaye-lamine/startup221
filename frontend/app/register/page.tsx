"use html";
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Palette,
  Globe,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Field States
  const [name, setName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [city, setCity] = useState("");
  const [mission, setMission] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [sector, setSector] = useState("Fintech");
  const [teamSize, setTeamSize] = useState("1-5 personnes");

  // Media States
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [primaryColor, setPrimaryColor] = useState("#3545E6");

  // Goals & Links States
  const [needs, setNeeds] = useState<string[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // File Change Handlers
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

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

  // Stepper Handlers
  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate registration processing
    try {
      // In a real application, you would make a fetch POST request here with FormData.
      // E.g.,
      // const formData = new FormData();
      // formData.append("name", name); ...
      // await fetch("/api/v1/startups/register", { method: "POST", body: formData })

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubmitted(true);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      console.error(err);
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
        {/* Horizontal Connector Line */}
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute left-0 top-1/2 h-[2px] bg-brand-active -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />

        {/* Step 1: Identité */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-sm ${
              step >= 1
                ? "bg-brand-active text-white scale-110"
                : "bg-slate-100 border border-slate-200 text-slate-400"
            }`}
          >
            1
          </div>
          <span
            className={`text-xs font-bold transition-colors ${
              step >= 1 ? "text-brand-active" : "text-slate-400"
            }`}
          >
            Identité
          </span>
        </div>

        {/* Step 2: Médias */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-sm ${
              step >= 2
                ? "bg-brand-active text-white scale-110"
                : step === 1
                ? "bg-white border-2 border-slate-200 text-slate-400"
                : "bg-slate-100 border border-slate-200 text-slate-400"
            }`}
          >
            2
          </div>
          <span
            className={`text-xs font-bold transition-colors ${
              step >= 2 ? "text-brand-active" : "text-slate-400"
            }`}
          >
            Médias
          </span>
        </div>

        {/* Step 3: Objectifs */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 shadow-sm ${
              step >= 3
                ? "bg-brand-active text-white scale-110"
                : "bg-white border-2 border-slate-200 text-slate-400"
            }`}
          >
            3
          </div>
          <span
            className={`text-xs font-bold transition-colors ${
              step >= 3 ? "text-brand-active" : "text-slate-400"
            }`}
          >
            Objectifs
          </span>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
        {submitted ? (
          /* Congratulatory message on submission success */
          <div className="p-12 text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Félicitations !</h2>
              <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                Votre startup **{name}** a été enregistrée avec succès. Redirection vers l'annuaire public en cours...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
            {/* Step 1 Content: Identité */}
            {step === 1 && (
              <div className="p-6 md:p-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nom de la startup <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: TechDakar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-[#EFF2FF]/30 border ${
                        errors.name ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-brand-active"
                      } px-4 py-3 rounded-xl text-sm outline-none transition-all`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Slogan */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Slogan
                    </label>
                    <input
                      type="text"
                      placeholder="L'innovation au service du Sénégal"
                      value={slogan}
                      onChange={(e) => setSlogan(e.target.value)}
                      className="w-full bg-[#EFF2FF]/30 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-brand-active transition-all"
                    />
                  </div>

                  {/* Date de creation */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date de création
                    </label>
                    <input
                      type="date"
                      value={creationDate}
                      onChange={(e) => setCreationDate(e.target.value)}
                      className="w-full bg-[#EFF2FF]/30 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-brand-active transition-all text-slate-600"
                    />
                  </div>

                  {/* Ville */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Dakar, Saint-Louis..."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full bg-[#EFF2FF]/30 border ${
                        errors.city ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-brand-active"
                      } px-4 py-3 rounded-xl text-sm outline-none transition-all`}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mission */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Mission <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Décrivez la raison d'être de votre entreprise..."
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className={`w-full bg-[#EFF2FF]/30 border ${
                      errors.mission ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-brand-active"
                    } px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none`}
                  />
                  {errors.mission && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.mission}
                    </p>
                  )}
                </div>

                {/* Problem & Solution side-by-side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Le Problème <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Quel besoin adressez-vous ?"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      className={`w-full bg-[#EFF2FF]/30 border ${
                        errors.problem ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-brand-active"
                      } px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none`}
                    />
                    {errors.problem && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.problem}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Votre Solution <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comment résolvez-vous ce problème ?"
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className={`w-full bg-[#EFF2FF]/30 border ${
                        errors.solution ? "border-red-300 focus:border-red-500" : "border-slate-200 focus:border-brand-active"
                      } px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none`}
                    />
                    {errors.solution && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.solution}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sector & Team Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Secteur d'activité
                    </label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full bg-[#EFF2FF]/30 border border-slate-200 px-4 py-3 rounded-xl text-sm bg-white outline-none focus:border-brand-active transition-all"
                    >
                      {["Fintech", "HealthTech", "AgriTech", "EdTech", "Logistique"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Taille de l'équipe
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full bg-[#EFF2FF]/30 border border-slate-200 px-4 py-3 rounded-xl text-sm bg-white outline-none focus:border-brand-active transition-all"
                    >
                      {["1-5 personnes", "5-10 personnes", "11-50 personnes", "51+ personnes"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Content: Médias */}
            {step === 2 && (
              <div className="p-6 md:p-10 space-y-8 animate-scale-up">
                {/* Image Upload Zone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Logo Drag & Drop */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Logo de la startup (format carré)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-brand-active hover:bg-brand-50/10 rounded-2xl p-6 transition-all relative flex flex-col items-center justify-center text-center min-h-[160px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      {logoPreview ? (
                        <div className="relative">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-20 h-20 rounded-xl object-contain border border-slate-100 bg-white"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2 text-slate-400">
                          <Upload className="w-8 h-8 mx-auto" />
                          <p className="text-xs font-semibold">
                            Glissez ou sélectionnez votre logo
                          </p>
                          <p className="text-[10px] text-slate-400">PNG, JPG jusqu'à 2MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Banner Drag & Drop */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Bannière (format paysage)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-brand-active hover:bg-brand-50/10 rounded-2xl p-6 transition-all relative flex flex-col items-center justify-center text-center min-h-[160px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      {bannerPreview ? (
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-100 relative bg-white flex items-center justify-center">
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2 text-slate-400">
                          <ImageIcon className="w-8 h-8 mx-auto" />
                          <p className="text-xs font-semibold">
                            Glissez ou sélectionnez votre bannière
                          </p>
                          <p className="text-[10px] text-slate-400">PNG, JPG jusqu'à 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color Selector */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Couleur principale de votre marque
                  </label>
                  
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-sm">
                    <div
                      className="w-12 h-12 rounded-xl shrink-0 border border-black/10 relative cursor-pointer overflow-hidden"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer scale-150"
                      />
                    </div>

                    <div className="flex-grow space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                        <Palette className="w-3.5 h-3.5" />
                        <span>Code HEX :</span>
                      </div>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="bg-transparent text-sm font-semibold uppercase text-slate-700 outline-none w-20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Content: Objectifs & Réseaux */}
            {step === 3 && (
              <div className="p-6 md:p-10 space-y-8 animate-scale-up">
                {/* Needs selection */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Que recherchez-vous en priorité ?
                  </label>

                  <div className="flex flex-wrap gap-2.5">
                    {["Investisseurs", "Partenaires", "Recrutement", "Visibilité"].map((need) => {
                      const isActive = needs.includes(need);
                      return (
                        <button
                          key={need}
                          type="button"
                          onClick={() => toggleNeed(need)}
                          className={`text-xs font-bold px-4 py-3 rounded-xl border transition-all ${
                            isActive
                              ? "bg-brand-active border-brand-active text-white shadow-sm"
                              : "bg-slate-50 border-slate-200/60 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {need === "Investisseurs" && "🎯 "}
                          {need === "Partenaires" && "🤝 "}
                          {need === "Recrutement" && "💼 "}
                          {need === "Visibilité" && "🚀 "}
                          <span>Cherche {need}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Social Networks Links */}
                <div className="space-y-5 pt-6 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Réseaux & Liens
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Website */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-1">
                        <Globe className="w-4 h-4" />
                        <span>Site Web</span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://votre-startup.sn"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full bg-[#EFF2FF]/30 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-brand-active transition-all"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-1">
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/company/votre-startup"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="w-full bg-[#EFF2FF]/30 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-brand-active transition-all"
                      />
                    </div>

                    {/* Twitter */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold mb-1">
                        <Twitter className="w-4 h-4" />
                        <span>Twitter / X</span>
                      </div>
                      <input
                        type="url"
                        placeholder="https://twitter.com/votre-startup"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        className="w-full bg-[#EFF2FF]/30 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none focus:border-brand-active transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Footer Action Buttons */}
            <div className="px-6 py-5 bg-slate-50/50 flex justify-between items-center gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Retour</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-2 bg-brand-active hover:bg-brand-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md ml-auto"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-brand-active hover:bg-brand-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 ml-auto"
                >
                  {submitting ? (
                    <span>Enregistrement...</span>
                  ) : (
                    <>
                      <span>Finaliser l'inscription</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
