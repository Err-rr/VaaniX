import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  name: string;
  email: string;
  initials: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  hasHydrated: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}

/**
 * Placeholder auth store. Google OAuth is not wired to a real backend yet —
 * this simulates a successful sign-in so the rest of the shell can gate on
 * `isAuthenticated`. Replace `signInWithGoogle` with a real OAuth redirect
 * once the FastAPI backend is connected.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      hasHydrated: false,
      signInWithGoogle: () =>
        set({
          isAuthenticated: true,
          user: { name: "Shivam Rao", email: "shivam@youngfoundersschool.com", initials: "SR" },
        }),
      signOut: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "voxaegis-auth",
      onRehydrateStorage: () => (state) => {
        // Mutate the about-to-be-applied state directly rather than calling
        // useAuthStore.setState here — this callback can run synchronously
        // during the `create(...)` call above, before the `useAuthStore`
        // binding itself has finished being assigned.
        if (state) state.hasHydrated = true;
      },
    }
  )
);
