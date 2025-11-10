import type { Admin, Project, BlogPost, Testimonial, Service, ContactMessage, NewsletterSubscriber, LoginCredentials, InsertContactMessage, InsertNewsletterSubscriber } from "@shared/schema";

const API_BASE = "";

export async function apiRequest<T = any>(method: string, url: string, data?: any): Promise<T> {
  const token = localStorage.getItem("auth_token");
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    apiRequest<{ admin: Admin; token: string }>("POST", "/api/auth/login", credentials),
};

// Projects API
export const projectsAPI = {
  getAll: () => apiRequest<Project[]>("GET", "/api/projects"),
  getById: (id: string) => apiRequest<Project>("GET", `/api/projects/${id}`),
};

// Blog API
export const blogAPI = {
  getAll: () => apiRequest<BlogPost[]>("GET", "/api/blog"),
  getBySlug: (slug: string) => apiRequest<BlogPost>("GET", `/api/blog/slug/${slug}`),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => apiRequest<Testimonial[]>("GET", "/api/testimonials"),
};

// Services API
export const servicesAPI = {
  getAll: () => apiRequest<Service[]>("GET", "/api/services"),
};

// Contact API
export const contactAPI = {
  submit: (data: InsertContactMessage) =>
    apiRequest("POST", "/api/contact", data),
};

// Newsletter API
export const newsletterAPI = {
  subscribe: (data: InsertNewsletterSubscriber) =>
    apiRequest("POST", "/api/newsletter/subscribe", data),
};

// Admin Projects API
export const adminProjectsAPI = {
  getAll: () => apiRequest<Project[]>("GET", "/api/admin/projects"),
  create: (data: any) => apiRequest<Project>("POST", "/api/admin/projects", data),
  update: (id: string, data: any) =>
    apiRequest<Project>("PATCH", `/api/admin/projects/${id}`, data),
  delete: (id: string) => apiRequest("DELETE", `/api/admin/projects/${id}`),
};

// Admin Blog API
export const adminBlogAPI = {
  getAll: () => apiRequest<BlogPost[]>("GET", "/api/admin/blog"),
  create: (data: any) => apiRequest<BlogPost>("POST", "/api/admin/blog", data),
  update: (id: string, data: any) =>
    apiRequest<BlogPost>("PATCH", `/api/admin/blog/${id}`, data),
  delete: (id: string) => apiRequest("DELETE", `/api/admin/blog/${id}`),
};

// Admin Messages API
export const adminMessagesAPI = {
  getAll: () => apiRequest<ContactMessage[]>("GET", "/api/admin/messages"),
  markAsRead: (id: string) =>
    apiRequest("PATCH", `/api/admin/messages/${id}/read`),
  delete: (id: string) => apiRequest("DELETE", `/api/admin/messages/${id}`),
};

// Admin Newsletter API
export const adminNewsletterAPI = {
  getAll: () => apiRequest<NewsletterSubscriber[]>("GET", "/api/admin/newsletter"),
  delete: (id: string) => apiRequest("DELETE", `/api/admin/newsletter/${id}`),
};

// Admin Profile API
export const adminProfileAPI = {
  get: () => apiRequest<Admin>("GET", "/api/admin/profile"),
  update: (data: any) => apiRequest<Admin>("PATCH", "/api/admin/profile", data),
};

// Admin Stats API
export const adminStatsAPI = {
  get: () =>
    apiRequest<{
      projectsCount: number;
      postsCount: number;
      unreadMessagesCount: number;
      subscribersCount: number;
    }>("GET", "/api/admin/stats"),
};
