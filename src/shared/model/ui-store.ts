import { create } from 'zustand';

export interface ToastItem {
  id: number;
  kind: 'success' | 'error';
  message: string;
}

interface UiState {
  toasts: ToastItem[];
  pushToast: (kind: ToastItem['kind'], message: string) => void;
  dismissToast: (id: number) => void;
  filtersDrawerOpen: boolean;
  setFiltersDrawerOpen: (open: boolean) => void;
}

let nextId = 1;

const TOAST_TTL_MS = 4500;

// Точечный клиентский UI-state: тосты и состояние мобильного драйвера фильтров.
export const useUiStore = create<UiState>((set, get) => ({
  toasts: [],
  pushToast: (kind, message) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, kind, message }] }));
    setTimeout(() => {
      if (get().toasts.some((t) => t.id === id)) get().dismissToast(id);
    }, TOAST_TTL_MS);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  filtersDrawerOpen: false,
  setFiltersDrawerOpen: (open) => set({ filtersDrawerOpen: open }),
}));
