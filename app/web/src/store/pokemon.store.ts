import { create } from 'zustand';
import type { PokemonType } from '@pokemon/types';

interface PokemonFilters {
  searchQuery: string;
  selectedType: PokemonType | null;
  showFavoritesOnly: boolean;
}

interface PokemonStore extends PokemonFilters {
  selectedPokemonId: number | null;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: PokemonType | null) => void;
  setShowFavoritesOnly: (show: boolean) => void;
  setSelectedPokemonId: (id: number | null) => void;
  resetFilters: () => void;
}

const initialState: PokemonFilters & { selectedPokemonId: number | null } = {
  searchQuery: '',
  selectedType: null,
  showFavoritesOnly: false,
  selectedPokemonId: null,
};

export const usePokemonStore = create<PokemonStore>((set) => ({
  ...initialState,
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedType: (type) => set({ selectedType: type, selectedPokemonId: null }),
  
  setShowFavoritesOnly: (show) => set({ showFavoritesOnly: show, selectedPokemonId: null }),
  
  setSelectedPokemonId: (id) => set({ selectedPokemonId: id }),
  
  resetFilters: () => set({
    searchQuery: '',
    selectedType: null,
    showFavoritesOnly: false,
  }),
}));
