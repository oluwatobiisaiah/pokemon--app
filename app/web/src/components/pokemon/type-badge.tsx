import { getPokemonTypeColor } from '@/src/lib/utils';
import type { PokemonType } from '@pokemon/types';
import { cn } from '@/src/lib/utils';

interface TypeBadgeProps {
  type: PokemonType | string;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  // getPokemonTypeColor returns tailwind classes like 'bg-pokemon-fire'
  const colorClass = getPokemonTypeColor(type as PokemonType) || 'bg-slate-700';

  return (
    <span
      title={String(type)}
      className={cn(
        colorClass,
        sizeClasses[size],
        'rounded-full text-white font-semibold capitalize shadow-sm inline-block'
      )}
      aria-hidden={false}
    >
      {String(type)}
    </span>
  );
}
