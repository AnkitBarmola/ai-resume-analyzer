import { create } from "zustand";
import { generateUUID } from "./utils";
import type { Resume } from "../types";
const mockResumes: Resume[] = []; // Load from constants if needed

// Mock types matching Puter
interface MockUser {
  uuid: string;
  username: string;
}

interface MockFSItem {
  id: string;
  name: string;
  path: string;
}

interface Feedback {
  overallScore: number;
  ATS: { score: number; tips: Array<{ type: string; tip: string }>; };
  // ... other sections
}

interface MockStore {
  isLoading: boolean;
  error: string | null;
  auth: {
    user: MockUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
  };
  kv: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<boolean>;
    delete: (key: string) => Promise<boolean>;
    list: (pattern: string, returnValues?: boolean) => Promise<any[]>;
  };
  ai: {
    feedback: (path: string, message: string) => Promise<{ message: { content: string } }>;
  };
  fs: {
    upload: (files: File[]) => Promise<MockFSItem>;
    read: (path: string) => Promise<Blob>;
  };
  clearError: () => void;
}

export const useMockStore = create<MockStore>((set, get) => ({
  isLoading: false,
  error: null,
  auth: {
    user: { uuid: "mock", username: "Demo User" },
    isAuthenticated: true,
    signIn: async () => set({ auth: { ...get().auth, isAuthenticated: true, user: { uuid: "mock", username: "Demo User" } } }),
    signOut: async () => set({ auth: { ...get().auth, isAuthenticated: false, user: null } }),
  },
  kv: {
    get: async (key: string) => {
      const data = localStorage.getItem(key);
      return data || null;
    },
    set: async (key: string, value: string) => {
      localStorage.setItem(key, value);
      return true;
    },
    delete: async (key: string) => {
      localStorage.removeItem(key);
      return true;
    },
    list: async (pattern: string, returnValues = false) => {
      // Mock from constants
      return returnValues ? mockResumes.map(r => ({ key: `resume:${r.id}`, value: JSON.stringify(r) })) : mockResumes.map(r => `resume:${r.id}`);
    },
  },
  ai: {
    feedback: async (path: string, message: string) => {
      // Mock AI response from constants first resume
      set({ isLoading: true });
      await new Promise(r => setTimeout(r, 2000)); // Simulate AI
      set({ isLoading: false });
      return {
        message: {
          content: JSON.stringify({
            overallScore: 85,
            ATS: { score: 90, tips: [] },
            toneAndStyle: { score: 90, tips: [] },
            content: { score: 90, tips: [] },
            structure: { score: 90, tips: [] },
            skills: { score: 90, tips: [] },
          })
        }
      };
    },
  },
  fs: {
    upload: async (files: File[]) => {
      return { id: generateUUID(), name: files[0].name, path: `/mock/${files[0].name}` };
    },
    read: async (path: string) => new Blob([]),
  },
  clearError: () => set({ error: null }),
}));

export default useMockStore;

