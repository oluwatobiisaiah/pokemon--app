'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Sparkles className="text-yellow-400 animate-pulse" size={40} />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Pokémon Manager
        </h1>
        <Sparkles className="text-yellow-400 animate-pulse" size={40} />
      </div>
      <p className="text-purple-300 text-base sm:text-lg font-medium">
        Browse and manage your favorite Pokémon
      </p>
    </motion.header>
  );
}