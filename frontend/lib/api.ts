/**
 * Centralized API configuration.
 * Uses NEXT_PUBLIC_API_URL env variable — set it in:
 *  - `.env.local` for local development
 *  - Netlify Dashboard → Site Settings → Environment Variables for production
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

export const API = {
  startups: {
    list: `${API_BASE}/api/v1/startups`,
    bySlug: (slug: string) => `${API_BASE}/api/v1/startups/${slug}`,
    contact: (id: string) => `${API_BASE}/api/v1/startups/${id}/contact`,
    upload: `${API_BASE}/api/v1/startups/upload`,
    trends: `${API_BASE}/api/v1/startups/trends`,
  },
  dashboard: {
    stats: (slug: string) => `${API_BASE}/api/v1/dashboard/stats/${slug}`,
    leads: (slug: string) => `${API_BASE}/api/v1/dashboard/leads/${slug}`,
    profile: (slug: string) => `${API_BASE}/api/v1/dashboard/profile/${slug}`,
    replyLead: (slug: string, leadId: string) =>
      `${API_BASE}/api/v1/dashboard/leads/${slug}/reply/${leadId}`,
    team: (slug: string) => `${API_BASE}/api/v1/dashboard/team/${slug}`,
    teamDelete: (slug: string, memberId: string) =>
      `${API_BASE}/api/v1/dashboard/team/${slug}/${memberId}`,
    needs: (slug: string) => `${API_BASE}/api/v1/dashboard/needs/${slug}`,
    needsDelete: (slug: string, needId: string) =>
      `${API_BASE}/api/v1/dashboard/needs/${slug}/${needId}`,
  },
  investors: {
    subscribe: `${API_BASE}/api/v1/investors/subscribe`,
    directory: `${API_BASE}/api/v1/investors/directory`,
    bySlug: (slug: string) => `${API_BASE}/api/v1/investors/directory/${slug}`,
  },
  partners: {
    list: `${API_BASE}/api/v1/partners`,
    programs: `${API_BASE}/api/v1/programs`,
    resources: `${API_BASE}/api/v1/resources`,
  },
  auth: {
    login: `${API_BASE}/api/v1/auth/login`,
  },
  admin: {
    investors: `${API_BASE}/api/v1/admin/investors`,
    startups: `${API_BASE}/api/v1/admin/startups`,
  },
} as const;
