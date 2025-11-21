'use client';

import { useMemo } from 'react';
import { trpc } from '@/src/lib/trpc';
import { usePokemonStore } from '@/src//store/pokemon.store';
import { PokemonGrid } from '@/src/components/pokemon/pokemon-grid';
import { SearchBar } from '@/src/components/ui/search-bar';
import { Header } from '@/src/components/layout/header';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';
import { EmptyState } from '@/src/components/ui/empty-state';
import { PokemonDetailModal } from '@/src/components/pokemon/pokemon-detail';
import { FilterBar } from '@/src/components/ui/filter-bar';
import { Pokemon } from '@pokemon/types';

export default function HomePage() {
  const {
    searchQuery,
    selectedType,
    showFavoritesOnly,
    selectedPokemonId,
    setSelectedPokemonId,
  } = usePokemonStore();

  const { data: pokemonList, isLoading: isPokemonLoading } = trpc.getList.useQuery(
    { limit: 10, offset: 0 }
  );

  const { data: favorites, isLoading: isFavoritesLoading } = trpc.getFavorites.useQuery();

  const favoriteIds = useMemo(
    () => new Set(favorites?.map((f) => f.pokemonId) || []),
    [favorites]
  );

  const allTypes = useMemo(() => {
    if (!pokemonList?.data) return [];
    const types = new Set<string>();
    pokemonList.data.forEach((p:Pokemon) => p.types.forEach((t) => types.add(t)));
    return Array.from(types).sort();
  }, [pokemonList]);

  const filteredPokemon = useMemo(() => {
    if (!pokemonList?.data) return [];

    return pokemonList.data.filter((pokemon: Pokemon) => {
      const matchesSearch = pokemon.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFavorite = !showFavoritesOnly || favoriteIds.has(pokemon.id);
      const matchesType = !selectedType || pokemon.types.includes(selectedType);

      return matchesSearch && matchesFavorite && matchesType;
    });
  }, [pokemonList, searchQuery, showFavoritesOnly, favoriteIds, selectedType]);

  const isLoading = isPokemonLoading || isFavoritesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />

        <div className="mb-8 space-y-4">
          <SearchBar />
          <FilterBar types={allTypes} favoritesCount={favorites?.length || 0} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPokemon.length === 0 ? (
          <EmptyState />
        ) : (
          <PokemonGrid
            pokemon={filteredPokemon}
            favoriteIds={favoriteIds}
            onPokemonClick={setSelectedPokemonId}
          />
        )}

        {selectedPokemonId && (
          <PokemonDetailModal
            pokemonId={selectedPokemonId}
            onClose={() => setSelectedPokemonId(null)}
          />
        )}
      </div>
    </div>
  );
}
