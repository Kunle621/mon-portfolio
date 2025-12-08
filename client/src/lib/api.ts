// client/src/lib/api.ts

const API_BASE = "http://localhost:5000/api";

// --- Helper pour gérer les réponses et erreurs HTTP ---
const handleResponse = async (response: Response) => {
  // On tente de parser le JSON, sinon on renvoie un objet vide pour éviter le crash
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Une erreur est survenue lors de la requête.");
  }

  return data;
};

// --- API générique ---
const api = {
  get: (url: string, token?: string) =>
    fetch(`${API_BASE}${url}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(handleResponse),

  post: (url: string, data: any, token?: string) =>
    fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }).then(handleResponse),

  patch: (url: string, data: any, token?: string) =>
    fetch(`${API_BASE}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (url: string, token?: string) =>
    fetch(`${API_BASE}${url}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(handleResponse),

  put: (url: string, data: any, token?: string) =>
    fetch(`${API_BASE}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// -----------------------------------------------------------------------------
//                                API SECTIONS
// -----------------------------------------------------------------------------

// --- PROJECTS ---
export const projectsAPI = {
  getAll: () => api.get("/projects"),
  create: (data: any, token: string) => api.post("/projects", data, token),
  delete: (id: string, token: string) => api.delete(`/projects/${id}`, token),
};

// --- CONTACT (public) ---
export const contactAPI = {
  submit: (data: any) => api.post("/contact", data),
};

// --- NEWSLETTER ---
export const newsletterAPI = {
  subscribe: (data: any) => api.post("/newsletter", data),
  getAll: (token: string) => api.get("/newsletter", token),
  delete: (id: string, token: string) => api.delete(`/newsletter/${id}`, token),
};

// --- AUTH ADMIN ---
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/admin/login", credentials),
  verifyOtp: (data: { email: string; otp: string }) =>
    api.post("/admin/verify-otp", data),
};

// --- ADMIN STATS ---
export const adminStatsAPI = {
  get: (token: string) => api.get("/admin/stats", token),
};

// --- ADMIN MESSAGES ---
export const adminMessagesAPI = {
  getAll: (token: string) => api.get("/contact", token),
  markRead: (id: string, token: string) =>
    api.patch(`/contact/${id}/read`, {}, token),
  delete: (id: string, token: string) => api.delete(`/contact/${id}`, token),
};

// --- PROFILE ---
export const profileAPI = {
  // ✅ CORRECTION : Pas d'argument ici car c'est une route publique
  get: () => api.get("/profile"),
  update: (data: any, token: string) => api.put("/profile", data, token),
};

// --- SERVICES ---
export const servicesAPI = {
  getAll: () => api.get("/services"),
  create: (data: any, token: string) => api.post("/services", data, token),
  delete: (id: string, token: string) => api.delete(`/services/${id}`, token),
};

// --- SKILLS ---
export const skillsAPI = {
  getAll: () => api.get("/skills"),
  create: (data: any, token: string) => api.post("/skills", data, token),
  delete: (id: string, token: string) => api.delete(`/skills/${id}`, token),
};