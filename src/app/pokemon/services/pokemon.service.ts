import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'https://pokeapi.co/api/v2';
    private cache = new Map<string, Observable<any>>();

    getPokemons(limit: number, offset: number): Observable<PokemonListResponse> {
        const key = `pokemons-${limit}-${offset}`;

        if (!this.cache.has(key)) {
            this.cache.set(key, this.http.get<PokemonListResponse>(
                `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
            ).pipe(shareReplay(1)));
        }

        return this.cache.get(key)!;
    }

    getPokemonDetails(id: string): Observable<PokemonDetails> {
        return this.http.get<PokemonDetails>(`${this.apiUrl}/pokemon/${id}`);
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