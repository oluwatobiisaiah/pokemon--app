'use client';

import { motion } from 'framer-motion';

export function PokemonCardSkeleton() {
  return (
    <motion.article
      className="bg-gradient-to-br from-white/3 via-white/2 to-transparent rounded-2xl p-3 sm:p-4 border border-slate-700"
    >
      {/* Sprite placeholder */}
      <div className="aspect-square mb-3 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900/40 to-slate-800/10 overflow-hidden">
        <div className="w-[120px] h-[120px] bg-slate-700/50 animate-pulse rounded-lg"></div>
      </div>

      {/* Meta placeholder */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="w-12 h-3 bg-slate-700/50 animate-pulse rounded"></div>
        </div>

        <div className="w-20 h-4 bg-slate-700/50 animate-pulse rounded"></div>

        <div className="flex flex-wrap gap-1 mt-1">
          <div className="w-12 h-5 bg-slate-700/50 animate-pulse rounded-full"></div>
          <div className="w-16 h-5 bg-slate-700/50 animate-pulse rounded-full"></div>
        </div>
      </div>
    </motion.article>
  );
}