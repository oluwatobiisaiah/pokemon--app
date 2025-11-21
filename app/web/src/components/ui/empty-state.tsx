'use client';

import { usePokemonStore } from '@/src/store/pokemon.store';
import { Search, Heart } from 'lucide-react';

export function EmptyState() {
  const { showFavoritesOnly, resetFilters } = usePokemonStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] text-center px-4 py-6">
      {showFavoritesOnly ? (
        <>
          <Heart size={84} className="text-slate-600 mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">No Favorites Yet</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 max-w-md">
            You haven't favorited any Pokémon. Click the heart on any card to add it to your favorites.
          </p>
        </>
      ) : (
        <>
          <Search size={84} className="text-slate-600 mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">No Pokémon Found</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-6 max-w-md">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </>
      )}

      <div className="flex gap-3">
        <button
          onClick={resetFilters}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
