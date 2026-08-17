import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const signOut = useAuthStore((state) => state.signOut);

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    isInitializing,
    signOut,
  };
}
