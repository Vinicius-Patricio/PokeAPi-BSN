import { FavoritesService } from "./favorites.service";

describe('FavoritesService', () =>{
    let service: FavoritesService;

    beforeEach(() =>{
        service = new FavoritesService();
        localStorage.clear();
    });

    it('deve adicionar um favorito', () =>{
        service.addFavorite(1);
        expect(service.getFavorites()).toContain(1);
    });

    it('deve remover um favorito',()=> {
        service.addFavorite(2);
        service.removeFavorite(2);
        expect(service.getFavorites()).not.toContain(2)
    });

    it('deve alternar favorito', () => {
        service.toggleFavorite(3);
        expect(service.isFavorite(3)).toBeTrue();
        service.toggleFavorite(3);
        expect(service.isFavorite(3)).toBeFalse();
    });
    
    it('deve retornar falso para pokémon não favoritado', () => {
        expect(service.isFavorite(999)).toBeFalse();
    });
});