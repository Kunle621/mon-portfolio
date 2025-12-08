import axios from "axios";

const API_URL = "/api/projects";

export const projectsAPI = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  create: async (data: any, token: string) => {
    const res = await axios.post(API_URL, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  delete: async (id: string, token: string) => {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  uploadImage: async (formData: FormData, token: string) => {
    const res = await axios.post(`${API_URL}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data; 
  },
};
