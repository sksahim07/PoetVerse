import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

interface PoemStore {
  // 🟢 States (The Memory)
  isWorkspaceActive: boolean; // ফর্ম হাইড করে ওয়ার্কস্পেস দেখানোর সুইচ
  currentPoemText: string;    // এডিটেড বা বর্তমান কবিতা
  originalPoemText: string;   // ব্যাকআপ (যদি ইউজার অরিজিনালটাতে ফিরে যেতে চায়)
  chatHistory: ChatMessage[]; // এআই আর ইউজারের কথোপকথন
  isGenerating: boolean;      // লোডিং স্টেট

  // 🔴 Actions (The Commands)
  startWorkspace: (initialText: string) => void;
  updatePoemText: (newText: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  setGenerating: (status: boolean) => void;
  resetWorkspace: () => void;
}

export const usePoemStore = create<PoemStore>((set) => ({
  isWorkspaceActive: false,
  currentPoemText: '',
  originalPoemText: '',
  chatHistory: [],
  isGenerating: false,

  startWorkspace: (initialText) => set({
    isWorkspaceActive: true,
    currentPoemText: initialText,
    originalPoemText: initialText,
    chatHistory: [{ 
      role: 'ai', 
      content: 'The draft is ready. How would you like to refine it? We can perfect the rhythm, change the metaphors, or deepen the philosophy.' 
    }]
  }),

  updatePoemText: (newText) => set({ currentPoemText: newText }),

  addChatMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, msg]
  })),

  setGenerating: (status) => set({ isGenerating: status }),

  resetWorkspace: () => set({
    isWorkspaceActive: false,
    currentPoemText: '',
    originalPoemText: '',
    chatHistory: [],
    isGenerating: false
  })
}));