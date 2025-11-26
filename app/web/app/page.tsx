'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { trpc } from '@/src/lib/trpc';
import { usePokemonStore } from '@/src//store/pokemon.store';
import { PokemonGrid } from '@/src/components/pokemon/pokemon-grid';
import { PokemonCardSkeleton } from '@/src/components/pokemon/pokemon-card-skeleton';
import { SearchBar } from '@/src/components/ui/search-bar';
import { Header } from '@/src/components/layout/header';
import { EmptyState } from '@/src/components/ui/empty-state';
import { PokemonDetailModal } from '@/src/components/pokemon/pokemon-detail';
import { FilterBar } from '@/src/components/ui/filter-bar';
import {Pokemon } from '@pokemon/types';

export default function HomePage() {
  const {
    searchQuery,
    selectedType,
    showFavoritesOnly,
    selectedPokemonId,
    setSelectedPokemonId,
  } = usePokemonStore();

  const [offset, setOffset] = useState(0);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingRef = useRef(false);
  const loadPerbatch = parseInt(process.env.NEXT_PUBLIC_POKEMON_LOAD_PER_BATCH || '40');
  const { data: pokemonList, isLoading: isPokemonLoading } = trpc.getList.useQuery(
    { limit: loadPerbatch, offset }
  );

  useEffect(() => {
    if (pokemonList?.data) {
      setAllPokemon(prev => [...prev, ...pokemonList.data]);
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [pokemonList]);

  const loadMore = () => {
    if (pokemonList?.hasMore && !loadingRef.current) {
      loadingRef.current = true;
      setIsLoadingMore(true);
      setOffset(prev => prev + loadPerbatch);
    }
  };

  useEffect(() => {
    setOffset(0);
    setAllPokemon([]);
    loadingRef.current = false;
    setIsLoadingMore(false);
  }, [selectedType, showFavoritesOnly]);

  const { data: favorites, isLoading: isFavoritesLoading } = trpc.getFavorites.useQuery();

  const favoriteIds = useMemo(() => {
    const ids = (favorites?.map((f) => f.pokemonId) ?? []) as number[];
    return new Set<number>(ids);
  }, [favorites]);

  const allTypes = useMemo(() => {
    if (!allPokemon) return [];
    const types = new Set<string>();
    allPokemon.forEach((p: Pokemon) => p.types.forEach((t) => types.add(t)));
    return Array.from(types).sort();
  }, [allPokemon]);

  const filteredPokemon = useMemo(() => {
    if (!allPokemon) return [];

    return allPokemon.filter((pokemon: Pokemon) => {
      const matchesSearch = pokemon.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFavorite = !showFavoritesOnly || favoriteIds.has(pokemon.id);
      const matchesType = !selectedType || pokemon.types.includes(selectedType);

      return matchesSearch && matchesFavorite && matchesType;
    });
  }, [allPokemon, searchQuery, showFavoritesOnly, favoriteIds, selectedType]);

  const isInitialLoading = allPokemon.length === 0 && isPokemonLoading;
  const isLoading = isInitialLoading || isFavoritesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />

        <div className="mb-8 space-y-4">
          <SearchBar />
          <FilterBar types={allTypes} favoritesCount={favorites?.length || 0} />
        </div>

        {isLoading ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            {Array.from({ length: 20 }).map((_, index) => (
              <PokemonCardSkeleton key={`initial-skeleton-${index}`} />
            ))}
          </motion.section>
        ) : filteredPokemon.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <PokemonGrid
              pokemon={filteredPokemon}
              favoriteIds={favoriteIds}
              onPokemonClick={setSelectedPokemonId}
            />
            {isLoadingMore && (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-4"
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <PokemonCardSkeleton key={`skeleton-${index}`} />
                ))}
              </motion.section>
            )}
            {pokemonList?.hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
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

