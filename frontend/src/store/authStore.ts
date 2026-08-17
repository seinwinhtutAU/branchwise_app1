import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

import { supabase } from "@/services/supabase";

interface AuthState {
  session: Session | null;
  isInitializing: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isInitializing: true,

  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    set({ session, isInitializing: false });

    supabase.auth.onAuthStateChange((_event, newSession) => {
      set({ session: newSession });
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));
