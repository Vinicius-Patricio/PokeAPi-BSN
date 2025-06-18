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
    generation?: string;
}

export interface PokemonDetails {
    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: {
        front_default: string;
        front_shiny: string;
        other: {
            'official-artwork': { front_default: string };
        };
    };
    types: { type: { name: string } }[];
    stats: {
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    };
    generation?: string;
}