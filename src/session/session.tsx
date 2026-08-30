import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';
import { setCustomerToken, registerUnauthorizedCallback } from '@/services/http';
import { login as loginService, register as registerService, getMe } from '@/services/auth';
import type { Customer } from '@/types/api';

const TOKEN_KEY = 'motos_customer_token';

interface SessionValue {
  customer: Customer | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const signOut = () => {
    SecureStore.deleteItemAsync(TOKEN_KEY);
    setCustomerToken(null);
    setCustomer(null);
    queryClient.clear();
  };

  useEffect(() => {
    registerUnauthorizedCallback(() => {
      signOut();
    });

    async function loadSession() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          setCustomerToken(token);
          const me = await getMe();
          setCustomer(me);
        }
      } catch {
        signOut();
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      customer,
      isLoggedIn: customer !== null,
      isLoading,
      async signIn(email, password) {
        const res = await loginService(email, password);
        await SecureStore.setItemAsync(TOKEN_KEY, res.token);
        setCustomerToken(res.token);
        setCustomer(res.customer);
      },
      async signUp(name, email, password) {
        const res = await registerService(name, email, password);
        await SecureStore.setItemAsync(TOKEN_KEY, res.token);
        setCustomerToken(res.token);
        setCustomer(res.customer);
      },
      signOut,
    }),
    [customer, isLoading, queryClient],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession precisa estar dentro de <SessionProvider>.');
  return ctx;
}