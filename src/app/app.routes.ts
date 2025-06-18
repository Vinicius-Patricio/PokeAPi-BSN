import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pokemon',
    loadComponent: () =>
      import('./pokemon/pokemon-list/pokemon-list.page').then(
        (m) => m.PokemonListPage
      ),
  },
  {
    path: 'pokemon/:id',
    loadComponent: () =>
      import('./pokemon/pokemon-detail/pokemon-detail.page')
      .then( (m) => m.PokemonDetailPage)
  },
  {
    path: '',
    redirectTo: 'pokemon',
    pathMatch: 'full',
  },
];
