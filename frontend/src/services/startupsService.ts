import axios from "axios";
import { StartupListItem } from "@/types/startup";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchStartups(minStage?: number): Promise<StartupListItem[]> {
  const params = minStage ? { minStage } : undefined;
  const response = await axios.get<StartupListItem[]>(`${API_BASE}/startup-api`, {
    params,
  });
  return response.data;
}

export async function fetchStartupById(id: string): Promise<StartupListItem> {
  const response = await axios.get<StartupListItem>(`${API_BASE}/startup-api/${id}`);
  return response.data;
}

export async function upvoteStartup(id: string): Promise<number> {
  const response = await axios.post<{ upvotes: number }>(
    `${API_BASE}/startup-api/${id}/upvote`
  );
  return response.data.upvotes;
}

export async function deleteStartup(id: string, email?: string): Promise<void> {
  await axios.delete(`${API_BASE}/startup-api/${id}`, {
    data: { requestingUserEmail: email },
  });
}
