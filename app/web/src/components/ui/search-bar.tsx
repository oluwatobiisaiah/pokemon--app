'use client';

import { Search, X } from 'lucide-react';
import { usePokemonStore } from '@/src/store/pokemon.store';
import { debounce } from '@/src/lib/utils';
import { useMemo, useState, useEffect } from 'react';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = usePokemonStore();
  const [localValue, setLocalValue] = useState(searchQuery);

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setSearchQuery(value), 300),
    [setSearchQuery]
  );

  useEffect(() => {
    debouncedSetQuery(localValue);
  }, [localValue, debouncedSetQuery]);

  const handleClear = () => {
    setLocalValue('');
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="text-slate-400" size={20} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search Pokémon by name..."
        className="w-full pl-12 pr-12 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}