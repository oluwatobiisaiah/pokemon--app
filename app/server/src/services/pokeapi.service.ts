import type { Pokemon, PokemonDetail, EvolutionChain, PokemonType } from '@pokemon/types';
import { cacheService } from './cache.service';
import { request } from 'undici';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const REQUEST_TIMEOUT = 30000;
const INITIAL_RETRY_DELAY = 1;
const MAX_RETRIES = 10;

interface PokeApiPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': { front_default: string };
      home: { front_default: string };
    };
  };
  types: Array<{ type: { name: string } }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
  }>;
  stats: Array<{
    stat: { name: string };
    base_stat: number;
    effort: number;
  }>;
  species: { url: string };
}

interface PokeApiListResponse {
  results: Array<{ name: string; url: string }>;
  count: number;
}

interface PokeApiSpecies {
  evolution_chain?: { url: string };
}

interface PokeApiAbility {
  effect_entries: Array<{
    language: { name: string };
    short_effect: string;
  }>;
}

interface PokeApiEvolutionChain {
  chain: PokeApiEvolutionNode;
}

interface PokeApiEvolutionNode {
  species: { name: string };
  evolution_details: Array<{
    min_level?: number;
    trigger?: { name: string };
  }>;
  evolves_to: PokeApiEvolutionNode[];
}

class PokeApiService {

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateBackoffDelay(attempt: number): number {
    const exponentialDelay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add up to 1s random jitter
    return exponentialDelay + jitter;
  }


  private async fetchWithCachAndRetry<T>(
    url: string,
    cacheKey: string,
    maxRetries = MAX_RETRIES,
    attempt = 0
  ): Promise<T> {
    const cached = cacheService.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const res = await request(url, { signal: controller.signal });
      const { statusCode, headers, body } = res;

      if (statusCode >= 200 && statusCode < 300) {
        const data = await body.json() as T;
        cacheService.set(cacheKey, data);
        return data;
      }

      if (statusCode === 429 && attempt < maxRetries) {
        const retryAfterHeader = headers["retry-after"];
        const retryAfter = retryAfterHeader
          ? parseInt(Array.isArray(retryAfterHeader) ? retryAfterHeader[0] : retryAfterHeader, 10) * 1000
          : this.calculateBackoffDelay(attempt);

        console.warn(
          `[429] Rate limited. Retry ${attempt + 1}/${maxRetries} in ${retryAfter}ms for ${url}`
        );

        await this.sleep(retryAfter);
        return this.fetchWithCachAndRetry<T>(url, cacheKey, maxRetries, attempt + 1);
      }

      if (statusCode >= 500 && attempt < maxRetries) {
        const delay = this.calculateBackoffDelay(attempt);
        console.warn(
          `[${statusCode}] Server error. Retry ${attempt + 1}/${maxRetries} in ${delay}ms for ${url}`
        );

        await this.sleep(delay);
        return this.fetchWithCachAndRetry<T>(url, cacheKey, maxRetries, attempt + 1);
      }

      // ----- NON-RETRYABLE -----
      throw new Error(`Request failed with status ${statusCode}`);
    } catch (err: any) {
      const retryable =
        err.name === "AbortError" ||
        err.code === "ECONNRESET" ||
        err.code === "ETIMEDOUT" ||
        err.code === "UND_ERR_CONNECT_TIMEOUT" ||
        err.code === "UND_ERR_HEADERS_TIMEOUT";

      if (retryable && attempt < maxRetries) {
        const delay = this.calculateBackoffDelay(attempt);
        console.warn(
          `[network-error] Retry ${attempt + 1}/${maxRetries} in ${delay}ms for ${url} — ${err.message}`
        );

        await this.sleep(delay);
        return this.fetchWithCachAndRetry<T>(url, cacheKey, maxRetries, attempt + 1);
      }

      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }


  async getPokemonList(limit = 150, offset = 0): Promise<Pokemon[]> {
    const cacheKey = `pokemon-list-${limit}-${offset}`;
    const cached = cacheService.get<Pokemon[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const listData = await this.fetchWithCachAndRetry<PokeApiListResponse>(
      `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
      `pokemon-list-meta-${limit}-${offset}`
    );

    const pokemonPromises = listData.results.map(async (item) => {
      const id = this.extractIdFromUrl(item.url);
      return this.getPokemonBasic(id);
    });

    const pokemonList = await Promise.all(pokemonPromises);
    cacheService.set(cacheKey, pokemonList);

    return pokemonList;
  }

  private async getPokemonBasic(id: number): Promise<Pokemon> {
    const cacheKey = `pokemon-basic-${id}`;
    const cached = cacheService.get<Pokemon>(cacheKey);
    if (cached) {
      return cached;
    }

    const data = await this.fetchWithCachAndRetry<PokeApiPokemon>(
      `${POKEAPI_BASE}/pokemon/${id}`,
      `pokemon-raw-${id}`
    );

    const pokemon = this.mapToPokemon(data);
    cacheService.set(cacheKey, pokemon);

    return pokemon;
  }

  async getPokemonDetail(id: number): Promise<PokemonDetail> {
    const cacheKey = `pokemon-detail-${id}`;
    const cached = cacheService.get<PokemonDetail>(cacheKey);
    if (cached) {
      return cached;
    }

    const pokemonData = await this.fetchWithCachAndRetry<PokeApiPokemon>(
      `${POKEAPI_BASE}/pokemon/${id}`,
      `pokemon-raw-${id}`
    );

    const speciesData = await this.fetchWithCachAndRetry<PokeApiSpecies>(
      pokemonData.species.url,
      `species-${id}`
    );

    let evolutionChain: EvolutionChain | null = null;

    if (speciesData.evolution_chain?.url) {
      try {
        const evolutionData = await this.fetchWithCachAndRetry<PokeApiEvolutionChain>(
          speciesData.evolution_chain.url,
          `evolution-${id}`
        );
        evolutionChain = this.mapEvolutionChain(evolutionData.chain);
      } catch (error) {
        console.error(`Failed to fetch evolution chain for Pokemon ${id}:`, error);
      }
    }

    const abilities = await Promise.all(
      pokemonData.abilities.map(async (a) => {
        try {
          const abilityData = await this.fetchWithCachAndRetry<PokeApiAbility>(
            a.ability.url,
            `ability-${a.ability.name}`
          );

          const effect = abilityData.effect_entries.find(
            (e) => e.language.name === 'en'
          )?.short_effect || '';

          return {
            name: this.formatName(a.ability.name),
            isHidden: a.is_hidden,
            slot: a.slot,
            effect,
          };
        } catch (error) {
          return {
            name: this.formatName(a.ability.name),
            isHidden: a.is_hidden,
            slot: a.slot,
          };
        }
      })
    );

    const detail: PokemonDetail = {
      ...this.mapToPokemon(pokemonData),
      abilities,
      stats: pokemonData.stats.map(s => ({
        name: this.formatName(s.stat.name),
        baseStat: s.base_stat,
        effort: s.effort,
      })),
      evolutionChain,
    };

    cacheService.set(cacheKey, detail);
    return detail;
  }

  private mapToPokemon(data: PokeApiPokemon): Pokemon {
    return {
      id: data.id,
      name: this.formatName(data.name),
      spriteUrl:
        data.sprites.other.home.front_default ||
        data.sprites.other['official-artwork'].front_default ||
        data.sprites.front_default,
      types: data.types.map(t => t.type.name as PokemonType),
      height: data.height,
      weight: data.weight,
    };
  }

  private mapEvolutionChain(chain: PokeApiEvolutionNode): EvolutionChain {
    const evolvesTo = chain.evolves_to?.map((e) =>
      this.mapEvolutionChain(e)
    ) || [];

    return {
      species: this.formatName(chain.species.name),
      minLevel: chain.evolution_details[0]?.min_level ?? null,
      trigger: chain.evolution_details[0]?.trigger?.name ?? null,
      evolvesTo,
    };
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return parseInt(parts[parts.length - 1], 10);
  }

  private formatName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

export const pokeApiService = new PokeApiService();