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
  ChevronLeft,
  CheckCircle2,
  X,
  Target,
  UserCheck,
} from "lucide-react";

export default function StartupDetailPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserSlug, setCurrentUserSlug] = useState<string | null>(null);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEntity, setSenderEntity] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [messageType, setMessageType] = useState("Investissement");
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    setCurrentUserSlug(localStorage.getItem("startup_slug"));
  }, []);

  const isOwnProfile =
    slug && currentUserSlug && slug.toLowerCase() === currentUserSlug.toLowerCase();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await fetch(API.startups.bySlug(slug as string));
        if (!response.ok) {
          throw new Error("Profile not found");
        }
        const data = await response.json();

        const enriched = {
          ...data,
          founding_date: data.created_at
            ? new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(
                new Date(data.created_at)
              )
            : "Récemment",
          team: data.team || [],
          needs_list: data.needs_list || [],
        };
        setStartup(enriched);
      } catch (err) {
        console.error("Error fetching startup profile:", err);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: senderName,
          sender_entity: senderEntity,
          sender_email: senderEmail,
          message_type: messageType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send contact");
      }

      setSenderName("");
      setSenderEntity("");
      setSenderEmail("");
      setMessageType("Investissement");
      setModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 5000);
    } catch (err) {
      setModalOpen(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 animate-pulse space-y-8">
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-1/3 bg-slate-200 rounded-lg" />
            <div className="h-32 bg-slate-100 rounded-2xl" />
          </div>
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="max-w-md mx-auto py-28 text-center space-y-4">
        <p className="text-slate-500 font-bold text-lg">Profil introuvable</p>
        <button
          onClick={() => router.push("/")}
          className="bg-brand-active text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-brand-600 transition-all"
        >
          Retour à l&apos;annuaire
        </button>
      </div>
    );
  }

  return (
    <div className="bg-brand-paper min-h-screen pb-24">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-dark text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-extrabold">Message transmis avec succès !</p>
            <p className="text-xs text-white/70">La startup {startup.name} a bien reçu votre prise de contact.</p>
          </div>
        </div>
      )}

      {/* Hero Cover Header */}
      <section className="relative bg-gradient-to-r from-brand-dark via-slate-900 to-brand-dark text-white pt-10 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10 mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour à l&apos;annuaire</span>
          </button>
        </div>
      </section>

      {/* Profile Card Header Overlap */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10 mb-10">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-slate-200/80 rounded-2xl p-2 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {startup.logo_url && startup.logo_url !== "#" ? (
                <img src={startup.logo_url} alt={startup.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full rounded-xl bg-brand-50 flex items-center justify-center text-2xl font-extrabold text-brand-active">
                  {startup.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {startup.name}
                </h1>
                <span className="text-xs font-bold px-3 py-1 bg-brand-50 text-brand-active border border-brand-100 rounded-full">
                  {startup.sector}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Inscrit en {startup.founding_date} • {startup.city || "Sénégal"}
              </p>
            </div>
          </div>

          {isOwnProfile ? (
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="w-full sm:w-auto bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Briefcase className="w-4 h-4" />
              <span>Modifier ma fiche</span>
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto bg-brand-active hover:bg-brand-600 text-white font-bold text-xs px-7 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
            >
              <Mail className="w-4 h-4" />
              <span>Contacter la startup</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description / Pitch */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                À propos
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                {startup.description}
              </p>

              {(startup.problem_statement || startup.solution_statement) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                  {startup.problem_statement && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-brand-gold uppercase tracking-wider block">
                        Le Problème ciblé
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {startup.problem_statement}
                      </p>
                    </div>
                  )}
                  {startup.solution_statement && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
                        La Solution proposée
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {startup.solution_statement}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Searches / Needs */}
            {startup.needs_list && startup.needs_list.length > 0 && (
              <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                  Recherches & Besoins de la Startup
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {startup.needs_list.map((need: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-brand-50 text-brand-active border border-brand-100">
                          {need.category}
                        </span>
                        <Target className="w-4 h-4 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900">{need.title}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {need.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Team Members */}
            {startup.team && startup.team.length > 0 && (
              <section className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
                <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-4">
                  L&apos;Équipe
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {startup.team.map((member: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex items-center gap-4"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-brand-50 border border-brand-100 shrink-0 flex items-center justify-center text-brand-active font-extrabold text-sm">
                        {member.avatar_url && member.avatar_url.startsWith("http") ? (
                          <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-900 truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium truncate">{member.role}</p>
                        {member.linkedin_url && member.linkedin_url.length > 5 && (
                          <a
                            href={
                              member.linkedin_url.startsWith("http")
                                ? member.linkedin_url
                                : `https://${member.linkedin_url}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-active hover:underline mt-1"
                          >
                            <Linkedin className="w-3 h-3" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Details & Actions */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Détails clés
              </h3>

              <div className="space-y-5">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Effectif
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {startup.employee_count} collaborateurs
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Stade de financement
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {startup.funding_stage}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      Localisation
                    </span>
                    <span className="font-extrabold text-slate-800">
                      {startup.city || "Sénégal"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Liens utiles
                </span>

                {startup.website_url && startup.website_url !== "#" && startup.website_url.trim() !== "" && (
                  <a
                    href={
                      startup.website_url.startsWith("http")
                        ? startup.website_url
                        : `https://${startup.website_url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-slate-600 hover:text-brand-active text-xs font-bold transition-colors"
                  >
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{startup.website_url}</span>
                  </a>
                )}

                {startup.twitter_url && startup.twitter_url !== "#" && startup.twitter_url.trim() !== "" && (
                  <a
                    href={
                      startup.twitter_url.startsWith("http")
                        ? startup.twitter_url
                        : `https://${startup.twitter_url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-slate-600 hover:text-brand-active text-xs font-bold transition-colors"
                  >
                    <Twitter className="w-4 h-4 text-slate-400" />
                    <span>Twitter / X</span>
                  </a>
                )}

                {startup.linkedin_url && startup.linkedin_url !== "#" && startup.linkedin_url.trim() !== "" && (
                  <a
                    href={
                      startup.linkedin_url.startsWith("http")
                        ? startup.linkedin_url
                        : `https://${startup.linkedin_url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-slate-600 hover:text-brand-active text-xs font-bold transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-slate-400" />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-brand-dark text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-md relative overflow-hidden">
              <div className="w-32 h-32 bg-white/5 rounded-full blur-2xl absolute -top-10 -right-10 pointer-events-none" />
              <h3 className="font-extrabold text-base text-white relative z-10">
                Vous souhaitez contacter {startup.name} ?
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium relative z-10">
                Envoyez un message direct à l&apos;équipe dirigeante pour discuter d&apos;opportunités d&apos;investissement, de partenariats ou de recrutement.
              </p>
              <button
                onClick={() => (isOwnProfile ? router.push("/dashboard/profile") : setModalOpen(true))}
                className="w-full bg-white text-brand-active hover:bg-white/90 font-bold text-xs py-3 rounded-xl transition-all relative z-10 shadow-sm"
              >
                {isOwnProfile ? "Gérer mon profil" : "Envoyer un message"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTACT MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-active bg-brand-50 px-2.5 py-1 rounded-md">
                Prise de contact
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                Contacter {startup.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Votre message sera transmis au tableau de bord des fondateurs.
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Votre nom
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Mariama Diallo"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-brand-active"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Organisation / Entité
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Teranga Capital ou Angel Investor"
                  value={senderEntity}
                  onChange={(e) => setSenderEntity(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-brand-active"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Votre e-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="mariama@terangacapital.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-brand-active"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Motif de contact
                </label>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full border border-slate-200 px-4 py-2.5 rounded-xl text-xs outline-none focus:border-brand-active bg-white"
                >
                  <option value="Investissement">Opportunité d&apos;Investissement</option>
                  <option value="Partenariat">Proposition de Partenariat</option>
                  <option value="Recrutement">Recrutement / Candidature</option>
                  <option value="Autre">Autre prise de contact</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-active hover:bg-brand-600 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md disabled:opacity-70"
              >
                {submitting ? "Envoi du message..." : "Envoyer le message"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
