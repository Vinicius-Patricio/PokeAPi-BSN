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
    path: '',
    redirectTo: 'pokemon',
    pathMatch: 'full',
  },

];
