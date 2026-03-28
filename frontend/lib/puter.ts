import { create } from "zustand";
import { generateUUID } from "./utils";
import type { Resume, Feedback, FSItem } from "../types";

const API_BASE = "http://localhost:8000/api";

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  auth: {
    user: { uuid: string; username: string; email?: string } | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
  };
  kv: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<boolean>;
    delete: (key: string) => Promise<boolean>;
    list: (pattern: string, returnValues?: boolean) => Promise<any[]>;
    flush: () => Promise<void>;
  };
  fs: {
    upload: (files: File[]) => Promise<FSItem>;
    read: (path: string) => Promise<Blob>;
    delete: (path: string) => Promise<boolean>;
    readDir: (path: string) => Promise<FSItem[]>;
  };
  ai: {
    feedback: (path: string, message: string) => Promise<{ message: { content: string } }>;
  };
  clearError: () => void;
}

export const usePuterStore = create<PuterStore>((set, get) => ({
  isLoading: false,
  error: null,
  auth: {
    user: null,
    isAuthenticated: false,
    signIn: async () => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch(`${API_BASE}/auth/login/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Login failed");
        // Assume JWT in response, store token if needed
        const data = await response.json();
        set({ auth: { 
          ...get().auth, 
          isAuthenticated: true, 
          user: data.user || { uuid: "user", username: "User" } 
        } });
      } catch (err) {
        set({ error: (err as Error).message });
      } finally {
        set({ isLoading: false });
      }
    },
    signOut: async () => {
      set({ auth: { ...get().auth, isAuthenticated: false, user: null } });
    },
  },
  kv: {
    get: async (key: string) => {
      try {
        const id = key.replace("resume:", "");
        const response = await fetch(`${API_BASE}/resumes/${id}/`, {
          credentials: "include",
          headers: { Authorization: "Bearer token-if-needed" },
        });
        if (!response.ok) return null;
        const data = await response.json();
        return JSON.stringify(data); // Match mock format
      } catch {
        return null;
      }
    },
    set: async (key: string, value: string) => {
      try {
        set({ isLoading: true });
        const id = key.replace("resume:", "");
        const data = JSON.parse(value);
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (k === "resumePath" || k === "imagePath") return; // Files uploaded separately via fs
          formData.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
        });
        const response = await fetch(`${API_BASE}/resumes/${id}/`, {
          method: "PUT",
          credentials: "include",
          body: formData,
        });
        return response.ok;
      } catch {
        return false;
      } finally {
        set({ isLoading: false });
      }
    },
    delete: async (key: string) => {
      try {
        const id = key.replace("resume:", "");
        const response = await fetch(`${API_BASE}/resumes/${id}/`, {
          method: "DELETE",
          credentials: "include",
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    list: async (pattern: string, returnValues = false) => {
      try {
        const response = await fetch(`${API_BASE}/resumes/`, { credentials: "include" });
        const resumes = await response.json();
        const keys = resumes.map((r: any) => `resume:${r.id}`);
        return returnValues ? keys.map(k => ({ key: k, value: JSON.stringify({ id: k.replace("resume:", ""), ...resumes.find((r: any) => r.id === k.replace("resume:", "")) }) })) : keys;
      } catch {
        return [];
      }
    },
    flush: async () => {
      // Delete all user resumes
      const keys = await get().kv.list("resume:", false);
      await Promise.all(keys.map(k => get().kv.delete(k)));
    },
  },
  fs: {
    upload: async (files: File[]) => {
      try {
        set({ isLoading: true, error: null });
        const formData = new FormData();
        files.forEach(f => formData.append("file", f));
        const response = await fetch(`${API_BASE}/resumes/upload/`, { // Will need endpoint
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await response.json();
        return { id: data.id, name: files[0].name, path: data.path };
      } catch (err) {
        set({ error: (err as Error).message });
        return { id: "", name: "", path: "" };
      } finally {
        set({ isLoading: false });
      }
    },
    read: async (path: string) => {
      try {
        const response = await fetch(`${API_BASE}/resumes/file/${encodeURIComponent(path)}/`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("File not found");
        return await response.blob();
      } catch {
        return new Blob([]);
      }
    },
    delete: async (path: string) => {
      try {
        const response = await fetch(`${API_BASE}/resumes/file/${encodeURIComponent(path)}/`, {
          method: "DELETE",
          credentials: "include",
        });
        return response.ok;
      } catch {
        return false;
      }
    },
    readDir: async (path: string) => {
      // Mock dir for /, return resumes as files
      return []; // Implement as /api/resumes/ mapped to files
    },
  },
  ai: {
    feedback: async (path: string, message: string) => {
      try {
        set({ isLoading: true, error: null });
        const response = await fetch(`${API_BASE}/analyze/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path, message }),
        });
        return await response.json();
      } catch (err) {
        set({ error: (err as Error).message });
        return { message: { content: "Error" } };
      } finally {
        set({ isLoading: false });
      }
    },
  },
  clearError: () => set({ error: null }),
}));

export default usePuterStore;

