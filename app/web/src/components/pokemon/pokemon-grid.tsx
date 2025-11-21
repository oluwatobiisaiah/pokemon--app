'use client';

import { motion } from 'framer-motion';
import { PokemonCard } from './pokemon-card';
import type { Pokemon } from '@pokemon/types';

interface PokemonGridProps {
  pokemon: Pokemon[];
  favoriteIds: Set<number>;
  onPokemonClick: (id: number) => void;
}

export function PokemonGrid({
  pokemon,
  favoriteIds,
  onPokemonClick,
}: PokemonGridProps) {
  if (!Array.isArray(pokemon) || pokemon.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      aria-live="polite"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
    >
      {pokemon.map((p, index) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(0.02 * index, 0.6), duration: 0.35 }}
        >
          <PokemonCard
            pokemon={p}
            isFavorite={favoriteIds.has(p.id)}
            onClick={() => onPokemonClick(p.id)}
          />
        </motion.div>
      ))}
    </motion.section>
  );
}
