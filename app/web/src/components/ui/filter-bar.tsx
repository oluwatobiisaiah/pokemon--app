'use client';

import { Heart, RotateCcw } from 'lucide-react';
import { usePokemonStore } from '@/src/store/pokemon.store';
import { getPokemonTypeColor } from '@/src/lib/utils';
import type { PokemonType } from '@pokemon/types';

interface FilterBarProps {
    types: string[];
    favoritesCount: number;
}

export function FilterBar({ types, favoritesCount }: FilterBarProps) {
    const {
        selectedType,
        showFavoritesOnly,
        setSelectedType,
        setShowFavoritesOnly,
        resetFilters,
    } = usePokemonStore();

    const hasActiveFilters = selectedType !== null || showFavoritesOnly;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
                <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showFavoritesOnly
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/50'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    aria-label={showFavoritesOnly ? 'Show all Pokémon' : 'Show favorites only'}
                >
                    <Heart
                        size={18}
                        className={showFavoritesOnly ? 'fill-current' : ''}
                    />
                    <span className="hidden sm:inline">Favorites</span> ({favoritesCount})
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                        aria-label="Reset filters"
                    >
                        <RotateCcw size={18} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-slate-400 text-sm font-medium mr-2">
                    Filter by type:
                </span>
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() =>
                            setSelectedType(selectedType === type ? null : (type as PokemonType))
                        }
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${selectedType === type
                                ? `${getPokemonTypeColor(type as PokemonType)} text-white shadow-lg`
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        aria-label={`Filter by ${type} type`}
                        aria-pressed={selectedType === type}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
}