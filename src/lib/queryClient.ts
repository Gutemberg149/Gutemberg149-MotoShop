/**
 * O QueryClient é o "cérebro" do TanStack Query: guarda o cache, controla
 * quando um dado está "stale" (velho) e quando refazer a busca.
 *
 * Estes defaults valem para o app inteiro (dá para sobrescrever por query).
 */
import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/types/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      staleTime: 1000 * 30, // 30s
      gcTime: 1000 * 60 * 5, // 5min
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
