'use client';

import { motion } from 'framer-motion';
import type { Stat } from '@pokemon/types';
import { getStatColor } from '@/src/lib/utils';

interface StatBarProps {
  stat: Stat | { name: string; baseStat: number };
}

export function StatBar({ stat }: StatBarProps) {
  const base = (stat as any).baseStat ?? 0;
  const name = (stat as any).name ?? 'stat';
  const maxStat = 255;
  const percentage = Math.max(0, Math.min(100, (base / maxStat) * 100));

  const colorClass = getStatColor(base);

  return (
    <div>
      <div className="flex justify-between mb-1 items-center">
        <span className="text-slate-300 font-medium capitalize text-sm">{name}</span>
        <span className="text-white font-bold text-sm">{base}</span>
      </div>

      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${colorClass} rounded-full`}
        />
      </div>
    </div>
  );
}
