import { create } from 'zustand';
import { Equipment } from '@/types';
import { differenceInDays, startOfDay } from 'date-fns';

export interface CartItem extends Equipment {
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    rentalDays: number;

    // Ações
    addItem: (equipment: Equipment) => void;
    removeItem: (equipmentId: string) => void;
    updateQuantity: (equipmentId: string, quantity: number) => void;
    setRentalDays: (days: number) => void;
    clearCart: () => void;

    // Computados (Getters)
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    rentalDays: 1,

    addItem: (equipment) => set((state) => {
        const existing = state.items.find(item => item.id === equipment.id);
        if (existing) {
            return {
                items: state.items.map(item =>
                    item.id === equipment.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            };
        }
        return { items: [...state.items, { ...equipment, quantity: 1 }] };
    }),

    removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
    })),

    updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
    })),

    setRentalDays: (days) => set({ rentalDays: Math.max(1, days) }),

    clearCart: () => set({ items: [], rentalDays: 1 }),

    getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

    getTotalPrice: () => {
        const { items, rentalDays } = get();
        const itemsTotal = items.reduce((total, item) => total + (item.price_per_day * item.quantity), 0);
        return itemsTotal * rentalDays;
    }
}));
