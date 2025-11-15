// client/src/lib/api.ts
const API_BASE = "http://localhost:5000/api";

// API générique
const api = {
  get: (url: string, token?: string) =>
    fetch(`${API_BASE}${url}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(res => res.json()),

  post: (url: string, data: any, token?: string) =>
    fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ... (token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    }).then(res => res.json()),
};

// API pour les projets
export const projectsAPI = {
  getAll: () => api.get("/projects"),
  create: (data: any, token: string) => api.post("/projects", data, token),
};

// API pour les contacts
export const contactAPI = {
  submit: (data: any) => api.post("/contact", data),
};

// API pour la newsletter
export const newsletterAPI = {
  subscribe: (data: any) => api.post("/newsletter", data),
};

// API pour l'authentification admin
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/admin/login", credentials),
};

// API pour le dashboard admin
export const adminStatsAPI = {
  get: (token: string) => api.get("/admin/stats", token),
};

export const adminMessagesAPI = {
  getAll: (token: string) => api.get("/admin/messages", token),
};