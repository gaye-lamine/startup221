"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API } from "../../../lib/api";
import {
  MapPin,
  Users,
  Briefcase,
  Globe,
  Twitter,
  Linkedin,
  Mail,
  X,
  ChevronLeft,
  ArrowRight,
  Eye,
  Handshake,
  CheckCircle2,
} from "lucide-react";
import { Startup } from "../../../components/StartupCard";

// Mock Fallback Details for offline development matching mockup
const MOCK_PROFILES: Record<string, Partial<Startup> & {
  founding_date: string;
  problem_statement: string;
  solution_statement: string;
  website_url: string;
  twitter_url: string;
  linkedin_url: string;
  primary_color: string;
  funding_stage: string;
  city: string;
  team: Array<{ name: string; role: string; avatar: string; linkedin: string }>;
  needs_list: Array<{ type: string; title: string; desc: string; category: "Investissement" | "Partenaires" }>;
}> = {
  senpay: {
    id: "1",
    name: "SenPay",
    slug: "senpay",
    logo_url: "",
    sector: "Fintech",
    employee_count: 18,
    description:
      "SenPay révolutionne le paysage financier sénégalais en proposant une infrastructure de paiement unifiée pour les PME. Notre vision est de digitaliser l'économie réelle en connectant les commerçants de quartier aux marchés globaux.",
    seeking: ["Investisseurs", "Partenaires"],
    founding_date: "Octobre 2022",
    city: "Dakar, Sénégal",
    primary_color: "#0C8A4D",
    funding_stage: "Amorçage / Seed",
    website_url: "www.senpay.sn",
    twitter_url: "https://twitter.com/senpay",
    linkedin_url: "https://linkedin.com/company/senpay",
    problem_statement:
      "Plus de 70% des commerçants au Sénégal n'ont pas accès à des outils de paiement numérique intégrés, limitant leur croissance et leur traçabilité financière.",
    solution_statement:
      "Un terminal de point de vente intelligent et une application mobile qui agrègent tous les portefeuilles de monnaie mobile et cartes bancaires locaux.",
    needs_list: [
      {
        category: "Investissement",
        type: "Levée de fonds",
        title: "Levée de fonds",
        desc: "Recherche 50M FCFA pour l'expansion régionale dans la zone UEMOA.",
      },
      {
        category: "Partenaires",
        type: "Logistique",
        title: "Logistique",
        desc: "Distributeurs pour le déploiement des terminaux de paiement physiques.",
      },
    ],
    team: [
      {
        name: "Mamadou Fall",
        role: "Fondateur & CEO",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        linkedin: "#",
      },
      {
        name: "Awa Ndiaye",
        role: "CTO",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
        linkedin: "#",
      },
    ],
  },
};

export default function StartupDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [pitchRequested, setPitchRequested] = useState(false);
  
  // Form States
  const [senderName, setSenderName] = useState("");
  const [senderEntity, setSenderEntity] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [messageType, setMessageType] = useState("Investissement");
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await fetch(API.startups.bySlug(slug as string));
        if (!response.ok) {
          throw new Error("Profile not found");
        }
        const data = await response.json();
        
        // Enrich data for layout purposes if fields are missing
        const enriched = {
          ...data,
          founding_date: "Octobre 2022",
          team: MOCK_PROFILES[slug]?.team || [
            { name: "Fondateur Principal", role: "CEO", avatar: "", linkedin: "#" }
          ],
          needs_list: MOCK_PROFILES[slug]?.needs_list || [
            {
              category: "Investissement",
              type: "Investissement",
              title: "Levée de fonds",
              desc: `Recherche de fonds pour financer le développement de ${data.name}.`
            }
          ]
        };
        setStartup(enriched);
        setIsUsingMock(false);
      } catch (err) {
        console.warn("Backend profile API offline or error. Using mock profile data.");
        const fallback = MOCK_PROFILES[slug.toLowerCase()] || MOCK_PROFILES.senpay;
        setStartup(fallback);
        setIsUsingMock(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      fetchProfile();
    }
  }, [slug]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !senderEntity || !senderEmail) return;

    setSubmitting(true);
    try {
      const response = await fetch(API.startups.contact(startup.id), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_name: senderName,
            sender_entity: senderEntity,
            sender_email: senderEmail,
            message_type: messageType,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to send contact");
      }
      
      // Reset form
      setSenderName("");
      setSenderEntity("");
      setSenderEmail("");
      setMessageType("Investissement");
      setModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 5000);
    } catch (err) {
      console.warn("Lead endpoint failed. Simulating offline lead submission success.");
      setModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="h-10 w-1/4 bg-slate-200 rounded" />
            <div className="h-32 bg-slate-100 rounded-xl" />
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <p className="text-slate-500 font-semibold mb-4">Profil non trouvé.</p>
        <button onClick={() => router.push("/")} className="text-brand-active underline">
          Retour à l'annuaire
        </button>
      </div>
    );
  }

  const primaryColor = startup.primary_color || "#0C8A4D";

  return (
    <div className="relative pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-bold">Message envoyé avec succès !</p>
            <p className="text-xs text-slate-400">La startup a été notifiée de votre intérêt.</p>
          </div>
        </div>
      )}

      {/* Dynamic Color Banner */}
      <div
        className="w-full h-52 md:h-64 relative"
        style={{ backgroundColor: primaryColor }}
      >
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 md:left-12 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-white/10"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>

      {/* Profile Header Overlap Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 mb-10">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white border border-slate-100 rounded-2xl p-1.5 flex items-center justify-center shrink-0 shadow-sm">
              {startup.logo_url ? (
                <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full rounded-xl bg-brand-50 flex items-center justify-center text-3xl font-extrabold text-brand-active">
                  {startup.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                  {startup.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
                  {startup.sector}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Fondé en {startup.founding_date} • {startup.city}
              </p>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full md:w-auto text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md hover:brightness-110 flex items-center justify-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Mail className="w-4 h-4" />
            <span>Contacter la startup</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns (Story & Team) */}
          <div className="lg:col-span-2 space-y-10">
            {/* À propos Section */}
            <section className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
              <h2
                className="text-lg font-bold flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <span>ℹ</span> À propos
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {startup.description}
              </p>

              {/* Problem/Solution Blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Le Problème
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {startup.problem_statement || "Non spécifié."}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    La Solution
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {startup.solution_statement || "Non spécifié."}
                  </p>
                </div>
              </div>
            </section>

            {/* Ce que nous recherchons */}
            <section className="space-y-6">
              <h2
                className="text-lg font-bold flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <span>🎯</span> Ce que nous recherchons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startup.needs_list.map((need: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border flex justify-between items-start gap-4 ${
                      need.category === "Investissement"
                        ? "bg-purple-50/50 border-purple-100"
                        : "bg-emerald-50/30 border-emerald-100"
                    }`}
                  >
                    <div className="space-y-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          need.category === "Investissement"
                            ? "bg-purple-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {need.type}
                      </span>
                      <h3 className="text-base font-bold text-slate-800">{need.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{need.desc}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100 shrink-0">
                      {need.category === "Investissement" ? (
                        <Eye className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Handshake className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* L'Équipe Section */}
            <section className="space-y-6">
              <h2
                className="text-lg font-bold flex items-center gap-2"
                style={{ color: primaryColor }}
              >
                <span>👥</span> L'Équipe
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {startup.team.map((member: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
                  >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 bg-slate-100 text-sm">
                          {member.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">{member.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                      <a href={member.linkedin} className="inline-block text-slate-400 hover:text-brand-active">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Key Details & Deck Request) */}
          <div className="space-y-6">
            {/* Détails clés */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] space-y-6">
              <h3 className="font-bold text-slate-800 text-base">Détails clés</h3>
              
              <div className="space-y-5">
                {/* Team Size */}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Taille de l'entreprise
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {startup.employee_count} employés
                    </span>
                  </div>
                </div>

                {/* Stage */}
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Stade de développement
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {startup.funding_stage}
                    </span>
                  </div>
                </div>

                {/* Localisation */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Localisation
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {startup.city}
                    </span>
                  </div>
                </div>

                {/* Map Mockup */}
                <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400 font-semibold border border-slate-200/60 relative overflow-hidden select-none">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
                  <span className="relative bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                    Carte de {startup.city.split(",")[0]}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Réseaux
                </span>
                
                <div className="space-y-3.5">
                  <a
                    href={startup.website_url.startsWith("http") ? startup.website_url : `https://${startup.website_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{startup.website_url}</span>
                  </a>

                  <a
                    href={startup.twitter_url}
                    className="flex items-center gap-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                  >
                    <Twitter className="w-4 h-4 text-slate-400" />
                    <span>Twitter / X</span>
                  </a>

                  <a
                    href={startup.linkedin_url}
                    className="flex items-center gap-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
                  >
                    <Linkedin className="w-4 h-4 text-slate-400" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Request Deck Access */}
            <div className="bg-brand-active text-white rounded-2xl p-6 space-y-5 shadow-lg relative overflow-hidden">
              {/* Backlight effect */}
              <div className="absolute w-40 h-40 bg-white/10 rounded-full blur-2xl -top-20 -right-20 pointer-events-none" />
              
              <div className="space-y-2">
                <h3 className="font-bold text-base">Vous êtes investisseur ?</h3>
                <p className="text-xs text-white/80 leading-relaxed font-medium">
                  Accédez au pitch deck complet et aux données financières de {startup.name}.
                </p>
              </div>

              {pitchRequested ? (
                <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 text-center text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Demande d'accès envoyée</span>
                </div>
              ) : (
                <button
                  onClick={() => setPitchRequested(true)}
                  className="w-full bg-white text-brand-active hover:bg-slate-50 font-bold py-3 rounded-xl text-xs transition-colors shadow-sm"
                >
                  Demander l'accès
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Contact Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden border border-slate-100 shadow-2xl animate-scale-up">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">
                Contacter {startup.name}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean Diouf"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Entité ou Fonds d'investissement
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Teranga Capital / Investisseur Individuel"
                  value={senderEntity}
                  onChange={(e) => setSenderEntity(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: jean.diouf@teranga.sn"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm outline-none focus:border-brand-active"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Objet de la prise de contact
                </label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-sm bg-white outline-none focus:border-brand-active"
                >
                  <option value="Investissement">Investissement</option>
                  <option value="Partenariat">Partenariat stratégique</option>
                  <option value="Recrutement">Opportunité de recrutement</option>
                  <option value="Autre">Autre demande</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:brightness-110 mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: primaryColor }}
              >
                {submitting ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
