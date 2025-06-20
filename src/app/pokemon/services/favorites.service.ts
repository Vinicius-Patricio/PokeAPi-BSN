import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
    private storageKey = 'favoritePokemons';

    getFavorites(): number[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data).map((id: any) => Number(id)) : [];
    }

    isFavorite(id: number): boolean {
        return this.getFavorites().includes(id);
    }

    addFavorite(id: number) {
        const favs = this.getFavorites();
        if (!favs.includes(id)) {
            favs.push(id);
            localStorage.setItem(this.storageKey, JSON.stringify(favs));
        }
    }

    removeFavorite(id: number) {
        const favs = this.getFavorites().filter(favId => favId !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(favs));
    }

    toggleFavorite(id: number) {
        this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id);
    }
}