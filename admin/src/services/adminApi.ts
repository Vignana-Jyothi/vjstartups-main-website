import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6220";

// Create axios instance for admin routes
const adminClient = axios.create({ baseURL: `${BASE_URL}/admin-api` });

// Attach admin token from localStorage to every request
adminClient.interceptors.request.use((config) => {
  const stored = localStorage.getItem("vj_admin_user");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user.adminToken) {
        config.headers["Authorization"] = `Bearer ${user.adminToken}`;
      }
    } catch {}
  }
  return config;
});

// ─── Stats ──────────────────────────────────────────────────────────────────

export const fetchStats = async () => {
  const res = await adminClient.get("/stats");
  return res.data;
};

// ─── Users ──────────────────────────────────────────────────────────────────

export const fetchUsers = async (page = 1, limit = 20, search = "") => {
  const res = await adminClient.get("/users", { params: { page, limit, search } });
  return res.data;
};

export const updateUserRole = async (id: string, role: "user" | "admin") => {
  const res = await adminClient.patch(`/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await adminClient.delete(`/users/${id}`);
  return res.data;
};

// ─── Startups ────────────────────────────────────────────────────────────────

export const fetchStartups = async (page = 1, limit = 20, search = "", stage?: number) => {
  const res = await adminClient.get("/startups", { params: { page, limit, search, stage } });
  return res.data;
};

export const updateStartupStage = async (id: string, stage: number) => {
  const res = await adminClient.patch(`/startups/${id}/stage`, { stage });
  return res.data;
};

// ─── Ideas ───────────────────────────────────────────────────────────────────

export const fetchIdeas = async (page = 1, limit = 20, search = "") => {
  const res = await adminClient.get("/ideas", { params: { page, limit, search } });
  return res.data;
};

// ─── Problems ────────────────────────────────────────────────────────────────

export const fetchProblems = async (page = 1, limit = 20, search = "") => {
  const res = await adminClient.get("/problems", { params: { page, limit, search } });
  return res.data;
};
