'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, TrendingUp, Zap, Weight, Ruler } from 'lucide-react';
import Image from 'next/image';
import { trpc } from '@/src/lib/trpc';
import { LoadingSpinner } from '../ui/loading-spinner';
import { TypeBadge } from './type-badge';
import { EvolutionChain } from './evolution-chain';
import { StatBar } from './stat-bar';
import { formatPokemonId, formatWeight, formatHeight } from '@/src/lib/utils';
import { useEffect, useRef } from 'react';
import type { Pokemon } from '@pokemon/types';

interface PokemonDetailModalProps {
  pokemonId: number;
  onClose: () => void;
}

export function PokemonDetailModal({ pokemonId, onClose }: PokemonDetailModalProps) {
  const { data: pokemon, isLoading } = trpc.getDetail.useQuery({ id: pokemonId });
  const { data: favorites } = trpc.getFavorites.useQuery();

  const utils = trpc.useUtils();
  const addFavoriteMutation = trpc.addFavorite.useMutation({
    onSuccess: () => utils.getFavorites.invalidate(),
  });
  const removeFavoriteMutation = trpc.removeFavorite.useMutation({
    onSuccess: () => utils.getFavorites.invalidate(),
  });

  const isFavorite = favorites?.some((f) => f.pokemonId === pokemonId);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pokemon) return;

    if (isFavorite) {
      await removeFavoriteMutation.mutateAsync({ pokemonId });
    } else {
      await addFavoriteMutation.mutateAsync({
        pokemonId: pokemon.id,
        pokemonName: pokemon.name,
        pokemonSprite: pokemon.spriteUrl,
      });
    }
  };

  // Focus management + ESC handling
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Lock scroll
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button when opened
    setTimeout(() => closeButtonRef.current?.focus(), 80);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={pokemon ? `${pokemon.name} details` : 'Pokemon details'}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/60 rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-2xl"
        >
          <div className="flex justify-end">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {isLoading || !pokemon ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="px-2 sm:px-4 pb-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: image + basic stats */}
                <div className="space-y-4">
                  <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 flex flex-col items-center">
                    <div className="relative w-[260px] h-[260px]">
                      <Image
                        src={pokemon.spriteUrl || '/placeholder-pokemon.png'}
                        alt={pokemon.name}
                        fill
                        sizes="260px"
                        style={{ objectFit: 'contain' }}
                        className="drop-shadow-2xl"
                      />
                    </div>

                    <div className="mt-3 w-full flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-3 bg-slate-800 p-3 rounded-lg justify-center">
                        <Ruler size={18} />
                        <span className="font-medium">{formatHeight(pokemon.height)}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-3 bg-slate-800 p-3 rounded-lg justify-center">
                        <Weight size={18} />
                        <span className="font-medium">{formatWeight(pokemon.weight)}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleToggleFavorite}
                      disabled={addFavoriteMutation.isLoading || removeFavoriteMutation.isLoading}
                      aria-pressed={isFavorite}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/6 hover:bg-white/8 transition-colors"
                    >
                      <Heart size={18} className={isFavorite ? 'text-red-500' : 'text-white'} />
                      <span className="text-sm text-slate-100">{isFavorite ? 'Favorited' : 'Add favorite'}</span>
                    </button>
                  </div>
                </div>

                {/* Right: details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-mono text-purple-300">{formatPokemonId(pokemon.id)}</span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white capitalize">{pokemon.name}</h2>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {(pokemon.types || []).map((t) => (
                        <TypeBadge key={t} type={t} size="md" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Zap size={18} className="text-yellow-400" />
                      Abilities
                    </h3>
                    <div className="mt-2 space-y-2">
                      {(pokemon.abilities || []).map((ab) => (
                        <div key={ab.name} className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white capitalize">{ab.name}</span>
                              {ab.isHidden && <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full text-white">Hidden</span>}
                            </div>
                          </div>
                          {ab.effect && <p className="text-slate-400 text-sm mt-1">{ab.effect}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-400" />
                  Base Stats
                </h3>
                <div className="mt-3 space-y-3">
                  {(pokemon.stats || []).map((stat) => (
                    <StatBar key={stat.name} stat={stat as any} />
                  ))}
                </div>
              </div>

              {/* Evolution */}
              {pokemon.evolutionChain && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white">Evolution Chain</h3>
                  <div className="mt-3">
                    <EvolutionChain chain={pokemon.evolutionChain as any} />
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
