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

interface PokemonDetailModalProps {
  pokemonId: number;
  onClose: () => void;
}

export function PokemonDetailModal({ pokemonId, onClose }: PokemonDetailModalProps) {
  const { data: pokemon, isLoading } = trpc.getDetail.useQuery({ id: pokemonId });
  const { data: favorites } = trpc.getFavorites.useQuery();

  const utils = trpc.useUtils();
  const addFavoriteMutation = trpc.addFavorite.useMutation({
    onSuccess: () => {
      utils.getFavorites.invalidate();
    },
  });

  const removeFavoriteMutation = trpc.removeFavorite.useMutation({
    onSuccess: () => {
      utils.getFavorites.invalidate();
    },
  });

  const isFavorite = favorites?.some((f) => f.pokemonId === pokemonId);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!pokemon) return;

    try {
      if (isFavorite) {
        await removeFavoriteMutation.mutateAsync({
          pokemonId: pokemon.id
        });
      } else {
        console.log('Adding favorite with input:', {
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonSprite: pokemon.spriteUrl,
        });

        await addFavoriteMutation.mutateAsync({
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
          pokemonSprite: pokemon.spriteUrl,
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={pokemon ? `${pokemon.name} details` : 'Pokemon details'}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border-2 border-slate-700 scrollbar-thin"
        >
          <div className="sticky top-0 right-0 flex justify-end p-4 bg-gradient-to-b from-slate-900 to-transparent z-10">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="text-white" size={24} />
            </button>
          </div>

          {isLoading || !pokemon ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border-2 border-slate-700 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
                      <Image
                        src={pokemon.spriteUrl}
                        alt={pokemon.name}
                        width={300}
                        height={300}
                        className="relative z-10 drop-shadow-2xl"
                        priority
                      />
                    </div>

                    <button
                      onClick={handleToggleFavorite}
                      disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
                      className="absolute top-4 right-4 p-3 bg-slate-800/90 hover:bg-slate-700 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart
                        size={24}
                        className={`${isFavorite
                            ? 'text-red-500 fill-red-500'
                            : 'text-white'
                          } transition-all`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg flex-1 justify-center">
                      <Ruler size={20} className="flex-shrink-0" />
                      <span className="font-medium">{formatHeight(pokemon.height)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg flex-1 justify-center">
                      <Weight size={20} className="flex-shrink-0" />
                      <span className="font-medium">{formatWeight(pokemon.weight)}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                  <div>
                    <span className="text-purple-400 font-mono text-sm">
                      {formatPokemonId(pokemon.id)}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white capitalize mb-4">
                      {pokemon.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {pokemon.types.map((type) => (
                        <TypeBadge key={type} type={type} size="md" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      <Zap className="text-yellow-400" size={24} />
                      Abilities
                    </h3>
                    <div className="space-y-2">
                      {pokemon.abilities.map((ability) => (
                        <div
                          key={ability.name}
                          className="bg-slate-800 p-3 rounded-lg border border-slate-700"
                        >
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-white font-medium">
                              {ability.name}
                            </span>
                            {ability.isHidden && (
                              <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full text-white">
                                Hidden
                              </span>
                            )}
                          </div>
                          {ability.effect && (
                            <p className="text-slate-400 text-sm">{ability.effect}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="text-green-400" size={24} />
                    Base Stats
                  </h3>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat) => (
                      <StatBar key={stat.name} stat={stat} />
                    ))}
                  </div>
                </div>

                {/* Evolution Chain Section */}
                {pokemon.evolutionChain && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      Evolution Chain
                    </h3>
                    <EvolutionChain chain={pokemon.evolutionChain} />
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}