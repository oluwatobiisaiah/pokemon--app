import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { EvolutionChain as EvolutionChainType } from '@pokemon/types';

interface EvolutionChainProps {
  chain: EvolutionChainType;
}

export function EvolutionChain({ chain }: EvolutionChainProps) {
  const renderChain = (node: EvolutionChainType, depth = 0) =>{
    return (
      <div key={`${node.species}-${depth}`} className="flex items-center gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.2 }}
          className="bg-slate-800 px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 border-slate-700 hover:border-purple-500 transition-all"
        >
          <p className="text-white font-bold capitalize text-base sm:text-lg">
            {node.species}
          </p>
          {node.minLevel && (
            <p className="text-slate-400 text-xs sm:text-sm">Level {node.minLevel}</p>
          )}
          {node.trigger && !node.minLevel && (
            <p className="text-slate-400 text-xs sm:text-sm capitalize">
              {node.trigger}
            </p>
          )}
        </motion.div>

        {node.evolvesTo.length > 0 && (
          <>
            <ArrowRight className="text-purple-400 flex-shrink-0" size={20} />
            <div className="flex flex-col gap-4">
              {node.evolvesTo.map((evolution, index) => (
                <div key={index}>{renderChain(evolution, depth + 1)}</div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 p-4 sm:p-6 rounded-xl border border-slate-700 overflow-x-auto scrollbar-thin">
      {renderChain(chain)}
    </div>
  );
}