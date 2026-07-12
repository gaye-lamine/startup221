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
  },
  dashboard: {
    stats: (slug: string) => `${API_BASE}/api/v1/dashboard/stats/${slug}`,
    leads: (slug: string) => `${API_BASE}/api/v1/dashboard/leads/${slug}`,
    profile: (slug: string) => `${API_BASE}/api/v1/dashboard/profile/${slug}`,
  },
  investors: {
    subscribe: `${API_BASE}/api/v1/investors/subscribe`,
  },
  auth: {
    login: `${API_BASE}/api/v1/auth/login`,
  },
} as const;
