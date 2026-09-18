import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  customerForgotPassword as apiForgotPassword,
  customerLogin as apiLogin,
  customerRegister as apiRegister,
  fetchCustomerProfile,
  getCustomerToken,
  setCustomerToken,
  updateCustomerProfile,
  type ForgotPasswordPayload,
  type RegisterPayload,
  type UpdateProfilePayload,
} from "@/lib/axios";
import type { CustomerUser } from "@/lib/types";

const USER_KEY = "angels-customer-user";

interface CustomerAuthContextValue {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<CustomerUser>;
  register: (payload: RegisterPayload) => Promise<CustomerUser>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<{ message: string }>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<CustomerUser>;
  logout: () => void;
}

function readStoredUser(): CustomerUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as CustomerUser) : null;
  } catch {
    return null;
  }
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(readStoredUser);

  function persist(next: CustomerUser | null) {
    setUser(next);
    try {
      if (next) window.localStorage.setItem(USER_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(USER_KEY);
    } catch {
      // localStorage may be unavailable; session still works in memory.
    }
  }

  useEffect(() => {
    if (!getCustomerToken()) return;
    fetchCustomerProfile()
      .then(persist)
      .catch(() => {
        setCustomerToken(null);
        persist(null);
      });
  }, []);

  async function login(email: string, password: string) {
    const loggedInUser = await apiLogin(email, password);
    persist(loggedInUser);
    return loggedInUser;
  }

  async function register(payload: RegisterPayload) {
    const registeredUser = await apiRegister(payload);
    persist(registeredUser);
    return registeredUser;
  }

  async function forgotPassword(payload: ForgotPasswordPayload) {
    return apiForgotPassword(payload);
  }

  async function updateProfile(payload: UpdateProfilePayload) {
    const updatedUser = await updateCustomerProfile(payload);
    persist(updatedUser);
    return updatedUser;
  }

  function logout() {
    setCustomerToken(null);
    persist(null);
  }

  const value: CustomerAuthContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    forgotPassword,
    updateProfile,
    logout,
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx)
    throw new Error("useCustomerAuth must be used within a CustomerAuthProvider");
  return ctx;
}