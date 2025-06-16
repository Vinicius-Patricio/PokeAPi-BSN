import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'https://pokeapi.co/api/v2';

    getPokemons(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
        return this.http.get<PokemonListResponse>(
            `${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`
        );
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