import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:6220";

const api = axios.create({ baseURL: `${BASE_URL}/tasks-api` });

// Projects
export const fetchProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const fetchProjectById = async (id: string) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const createProject = async (data: {
  name: string;
  description?: string;
  color?: string;
  emoji?: string;
  createdBy: string;
  creatorName: string;
}) => {
  const res = await api.post("/projects", data);
  return res.data;
};

// Tasks
export const fetchTasks = async (projectId: string, status?: string) => {
  const res = await api.get("/tasks", { params: { projectId, status } });
  return res.data;
};

export const fetchTaskById = async (id: string) => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTask = async (data: {
  title: string;
  description?: string;
  projectId: string;
  priority?: string;
  dueDate?: string | null;
  labels?: string[];
  createdById: string;
  createdByName: string;
  assignee?: { userId: string | null; name: string | null; picture: string | null };
}) => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTaskStatus = async (id: string, status: string, order?: number) => {
  const res = await api.patch(`/tasks/${id}/status`, { status, order });
  return res.data;
};

export const addTaskComment = async (id: string, data: {
  content: string;
  authorId: string;
  authorName: string;
  authorPicture?: string;
}) => {
  const res = await api.post(`/tasks/${id}/comments`, data);
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
