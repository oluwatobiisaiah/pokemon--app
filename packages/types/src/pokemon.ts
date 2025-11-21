export interface Pokemon {
  id: number;
  name: string;
  spriteUrl: string;
  types: PokemonType[];
  height: number;
  weight: number;
}

export interface PokemonDetail extends Pokemon {
  abilities: Ability[];
  stats: Stat[];
  evolutionChain: EvolutionChain | null;
}

export interface Ability {
  name: string;
  isHidden: boolean;
  slot: number;
  effect?: string;
}

export interface Stat {
  name: string;
  baseStat: number;
  effort: number;
}

export interface EvolutionChain {
  species: string;
  minLevel: number | null;
  trigger: string | null;
  evolvesTo: EvolutionChain[];
}

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric'
  | 'grass' | 'ice' | 'fighting' | 'poison'
  | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark'
  | 'steel' | 'fairy';

export interface Favorite {
  id: number;
  pokemonId: number;
  pokemonName: string;
  addedAt: Date;
}