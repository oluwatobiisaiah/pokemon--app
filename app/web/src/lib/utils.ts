import type { PokemonType } from '@pokemon/types';

export const getPokemonTypeColor = (type: PokemonType): string => {
  const colors: Record<PokemonType, string> = {
    normal: 'bg-pokemon-normal',
    fire: 'bg-pokemon-fire',
    water: 'bg-pokemon-water',
    electric: 'bg-pokemon-electric',
    grass: 'bg-pokemon-grass',
    ice: 'bg-pokemon-ice',
    fighting: 'bg-pokemon-fighting',
    poison: 'bg-pokemon-poison',
    ground: 'bg-pokemon-ground',
    flying: 'bg-pokemon-flying',
    psychic: 'bg-pokemon-psychic',
    bug: 'bg-pokemon-bug',
    rock: 'bg-pokemon-rock',
    ghost: 'bg-pokemon-ghost',
    dragon: 'bg-pokemon-dragon',
    dark: 'bg-pokemon-dark',
    steel: 'bg-pokemon-steel',
    fairy: 'bg-pokemon-fairy',
  };
  return colors[type];
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

export const formatWeight = (weight: number): string => {
  return `${(weight / 10).toFixed(1)} kg`;
};

export const formatHeight = (height: number): string => {
  return `${(height / 10).toFixed(1)} m`;
};

export const getStatColor = (value: number): string => {
  if (value >= 120) return 'bg-green-500';
  if (value >= 90) return 'bg-blue-500';
  if (value >= 60) return 'bg-yellow-500';
  if (value >= 30) return 'bg-orange-500';
  return 'bg-red-500';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};