import { create } from 'zustand';

export type CompareItem = {
	id: string;
	slug: string;
	name: string;
	imageUrl?: string | null;
	priceCents: number;
	categorySlug?: string;
	specs?: Record<string, any>;
};

export type CompareState = {
	items: CompareItem[];
	maxItems: number;
};

export type CompareActions = {
	add: (item: CompareItem) => void;
	remove: (id: string) => void;
	clear: () => void;
	isInCompare: (id: string) => boolean;
};

export const useCompareStore = create<CompareState & CompareActions>((set, get) => ({
	items: [],
	maxItems: 4,
	add: (item) => {
		const { items, maxItems } = get();
		if (items.find((i) => i.id === item.id)) return;
		if (items.length >= maxItems) return;
		set({ items: [...items, item] });
	},
	remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
	clear: () => set({ items: [] }),
	isInCompare: (id) => !!get().items.find((i) => i.id === id),
}));