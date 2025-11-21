'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import type { Pokemon } from '@pokemon/types';
import { TypeBadge } from './type-badge';
import { formatPokemonId } from '@/src/lib/utils';
import { cn } from '@/src/lib/utils';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onClick: () => void;
}

export function PokemonCard({ pokemon, isFavorite, onClick }: PokemonCardProps) {
  // Fallback sprite if none available
  const sprite = pokemon.spriteUrl || '/placeholder-pokemon.png';

  return (
    <motion.article
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      aria-label={`Open details for ${pokemon.name}`}
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.985 }}
      className={cn(
        'group relative bg-gradient-to-br from-white/3 via-white/2 to-transparent rounded-2xl p-3 sm:p-4 cursor-pointer border border-slate-700 transition-shadow duration-150',
        'shadow-sm hover:shadow-lg'
      )}
    >
      {/* Favorite mark */}
      {isFavorite && (
        <div className="absolute top-3 right-3 z-20">
          <Heart
            size={18}
            className="text-red-500 fill-red-500 drop-shadow-sm"
            aria-hidden
          />
        </div>
      )}

      {/* Sprite */}
      <div className="aspect-square mb-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900/40 to-slate-800/10 overflow-hidden">
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={sprite}
            alt={pokemon.name}
            fill
            sizes="120px"
            style={{ objectFit: 'contain' }}
            className="group-hover:scale-105 transition-transform"
            onError={(e) => {
              // fallback if Next image cannot load external image (keeps typescript happy)
              // Note: Next/Image onError typing is quirky; we cast
              const target = e.target as HTMLImageElement | null;
              if (target) target.src = '/placeholder-pokemon.png';
            }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            {formatPokemonId(pokemon.id)}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-slate-100 group-hover:text-purple-400 transition-colors capitalize truncate">
          {pokemon.name}
        </h3>

        <div className="flex flex-wrap gap-1 mt-1">
          {(pokemon.types || []).map((t) => (
            <TypeBadge key={t} type={t} size="sm" />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
