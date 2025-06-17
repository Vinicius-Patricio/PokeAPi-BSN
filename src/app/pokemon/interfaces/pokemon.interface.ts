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
    types: string [];
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