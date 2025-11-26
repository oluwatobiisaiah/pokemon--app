'use client';

import { motion } from 'framer-motion';

export function PokemonDetailSkeleton() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8">
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Left Column - Image and Basic Info Skeleton */}
        <div className="space-y-6">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center border-2 border-slate-700 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
              <div className="w-[300px] h-[300px] bg-slate-700/50 animate-pulse rounded-lg relative z-10"></div>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-slate-800/90 animate-pulse rounded-full"></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg flex-1 justify-center">
              <div className="w-5 h-5 bg-slate-700/50 animate-pulse rounded"></div>
              <div className="w-16 h-4 bg-slate-700/50 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg flex-1 justify-center">
              <div className="w-5 h-5 bg-slate-700/50 animate-pulse rounded"></div>
              <div className="w-16 h-4 bg-slate-700/50 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Column - Details Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="w-20 h-4 bg-slate-700/50 animate-pulse rounded mb-2"></div>
            <div className="w-48 h-8 bg-slate-700/50 animate-pulse rounded mb-4"></div>
            <div className="flex flex-wrap gap-2">
              <div className="w-16 h-6 bg-slate-700/50 animate-pulse rounded-full"></div>
              <div className="w-20 h-6 bg-slate-700/50 animate-pulse rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="w-32 h-6 bg-slate-700/50 animate-pulse rounded mb-3"></div>
            <div className="space-y-2">
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="w-24 h-4 bg-slate-700/50 animate-pulse rounded mb-1"></div>
                <div className="w-full h-3 bg-slate-700/50 animate-pulse rounded"></div>
              </div>
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <div className="w-28 h-4 bg-slate-700/50 animate-pulse rounded mb-1"></div>
                <div className="w-full h-3 bg-slate-700/50 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="space-y-6">
        <div>
          <div className="w-32 h-6 bg-slate-700/50 animate-pulse rounded mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <div className="w-16 h-4 bg-slate-700/50 animate-pulse rounded"></div>
                  <div className="w-8 h-4 bg-slate-700/50 animate-pulse rounded"></div>
                </div>
                <div className="w-full h-2 bg-slate-700/50 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Evolution Chain Section Skeleton */}
        <div>
          <div className="w-40 h-6 bg-slate-700/50 animate-pulse rounded mb-4"></div>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700/50 animate-pulse rounded-full mx-auto mb-2"></div>
              <div className="w-12 h-3 bg-slate-700/50 animate-pulse rounded"></div>
            </div>
            <div className="w-8 h-8 bg-slate-700/50 animate-pulse rounded-full"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700/50 animate-pulse rounded-full mx-auto mb-2"></div>
              <div className="w-12 h-3 bg-slate-700/50 animate-pulse rounded"></div>
            </div>
            <div className="w-8 h-8 bg-slate-700/50 animate-pulse rounded-full"></div>
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-700/50 animate-pulse rounded-full mx-auto mb-2"></div>
              <div className="w-12 h-3 bg-slate-700/50 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}