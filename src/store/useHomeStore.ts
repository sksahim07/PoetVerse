import { create } from 'zustand';
import { getTodayVerse, getActiveEvent } from '../db/api';

interface HomeState {
  dailyVerse: any | null;
  activeEvent: any | null;
  isLoading: boolean;
  fetchHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  dailyVerse: null,
  activeEvent: null,
  isLoading: true,
  
  fetchHomeData: async () => {
    set({ isLoading: true });
    try {
      // Fetch both things at the same time for speed
      const [verse, event] = await Promise.all([
        getTodayVerse(),
        getActiveEvent()
      ]);
      
      set({ 
        dailyVerse: verse, 
        activeEvent: event, 
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to load home data", error);
      set({ isLoading: false });
    }
  }
}));