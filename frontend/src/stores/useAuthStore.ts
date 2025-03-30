import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: true,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn, isLoading: false }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
}));

export const useSyncAuth = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { setIsLoggedIn, setIsLoading } = useAuthStore();


  useEffect(() => {
    setIsLoading(isLoading);
    if (!isLoading) {
      setIsLoggedIn(isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);
};

export default useAuthStore;
