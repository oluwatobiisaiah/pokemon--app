'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label = 'Loading Pokémon...' }: LoadingSpinnerProps) {
  const sizeClasses: Record<string, string> = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite" aria-busy="true">
      <div className={`${sizeClasses[size]} border-purple-500 border-t-transparent rounded-full animate-spin`} />
      {label && <span className="text-slate-400 text-sm">{label}</span>}
    </div>
  );
}
