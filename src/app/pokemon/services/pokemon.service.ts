import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, shareReplay, forkJoin, map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'https://pokeapi.co/api/v2';
    private cache = new Map<string, Observable<any>>();
    private allPokemonsCache: PokemonBasicInfo[] = [];
    private cacheLoaded = false;

    getPokemons(limit: number, offset: number): Observable<PokemonListResponse> {
        const key = `pokemons-${limit}-${offset}`;

        if (!this.cache.has(key)) {
            this.cache.set(key, this.http.get<PokemonListResponse>(
                `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
            ).pipe(shareReplay(1)));
        }

        return this.cache.get(key)!;
    }
    
    getAllPokemons(): Observable<PokemonBasicInfo[]> {
        if (this.cacheLoaded && this.allPokemonsCache.length > 0) {
            return of(this.allPokemonsCache);
        }

        const key = 'all-pokemons';
        
        if (!this.cache.has(key)) {
            this.cache.set(key, this.http.get<PokemonListResponse>(
                `${this.apiUrl}/pokemon?limit=1&offset=0`
            ).pipe(
                switchMap(response => {

                    const totalPokemons = response.count;

                    return this.http.get<PokemonListResponse>(
                        `${this.apiUrl}/pokemon?limit=${totalPokemons}&offset=0`
                    );
                }),
                map(response => {
                    const pokemonsWithId = response.results.map((pokemon: any) => ({
                        ...pokemon,
                        id: this.extractIdFromUrl(pokemon.url),
                        types: [],
                        generation: this.getGenerationByPokemonId(this.extractIdFromUrl(pokemon.url))
                    }));
                    
                    this.allPokemonsCache = pokemonsWithId;
                    this.cacheLoaded = true;
                    
                    return pokemonsWithId;
                }),
                shareReplay(1)
            ));
        }

        return this.cache.get(key)!;
    }

    private extractIdFromUrl(url: string): string {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 2];
    }

    private getGenerationByPokemonId(id: string): string {
        const pokemonId = parseInt(id);
        
        if (pokemonId <= 151) return '1';
        if (pokemonId <= 251) return '2';
        if (pokemonId <= 386) return '3';
        if (pokemonId <= 493) return '4';
        if (pokemonId <= 649) return '5';
        if (pokemonId <= 721) return '6';
        if (pokemonId <= 809) return '7';
        if (pokemonId <= 905) return '8';
        if (pokemonId <= 1010) return '9';
        return '10';
    }

    getPokemonDetails(id: string): Observable<PokemonDetails> {
        return this.http.get<PokemonDetails>(`${this.apiUrl}/pokemon/${id}`);
    }

    getPokemonSpecies(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/pokemon-species/${id}`);
    }

    getEvolutionChain(url: string): Observable<any> {
        return this.http.get<any>(url);
    }
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonBasicInfo[];
}

export interface PokemonBasicInfo {
    name: string;
    url: string;
    id: string;
    types: string[];
}

export interface PokemonDetails {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': { front_default: string };
        };
    };
    types: { type: { name: string } }[];
}