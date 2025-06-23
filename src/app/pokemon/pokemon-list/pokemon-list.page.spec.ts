import { TestBed } from '@angular/core/testing';
import { PokemonListPage } from './pokemon-list.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';

describe('PokemonListPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        PokemonListPage
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
        { provide: Router, useValue: {} }
      ]
    }).compileComponents();
  });

  it('deve criar uma lista', () => {
    const fixture = TestBed.createComponent(PokemonListPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});

describe('PokemonListPage - Favoritos e Filtros', () => {
  let component: PokemonListPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PokemonListPage],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => null } } } },
        { provide: Router, useValue: {} },
        { provide: FavoritesService, useClass: MockFavoritesService }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(PokemonListPage);
    component = fixture.componentInstance;

    component.allPokemons = [
      { id: 1, name: 'bulbasaur', types: ['grass'], generation: '1' },
      { id: 2, name: 'ivysaur', types: ['grass'], generation: '1' },
      { id: 3, name: 'venusaur', types: ['grass'], generation: '1' }
    ] as any[];
  });

  it('deve filtrar apenas favoritos quando showFavoritesOnly=true', () => {
    component.showFavoritesOnly = true;
    component.applyFilters();
    expect(component.filteredPokemons.length).toBe(2);
    expect(component.filteredPokemons.map(p => p.id.toString())).toEqual(['1', '3']);
  });

  it('deve filtrar por nome', () => {
    component.searchTerm = 'ivy';
    component.applyFilters();
    expect(component.filteredPokemons.length).toBe(1);
    expect(component.filteredPokemons[0].name).toBe('ivysaur');
  });

  it('deve filtrar por tipo', () => {
    component.selectedType = 'grass';
    component.applyFilters();
    expect(component.filteredPokemons.length).toBe(3);
  });

  it('deve combinar filtro de favoritos e nome', () => {
    component.showFavoritesOnly = true;
    component.searchTerm = 'venus';
    component.applyFilters();
    expect(component.filteredPokemons.length).toBe(1);
    expect(component.filteredPokemons.map(p => p.id.toString())).toEqual(['3']);
  });
});

class MockFavoritesService {
  private favs = [1, 3];
  getFavorites() { return this.favs; }
  isFavorite(id: number) { return this.favs.includes(id); }
  addFavorite(id: number) { if (!this.favs.includes(id)) this.favs.push(id); }
  removeFavorite(id: number) { this.favs = this.favs.filter(f => f !== id); }
  toggleFavorite(id: number) { this.isFavorite(id) ? this.removeFavorite(id) : this.addFavorite(id); }
}