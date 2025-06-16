import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { PokemonBasicInfo } from '../interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.page.html',
  styleUrls: ['./pokemon-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    RouterModule
  ]
})
export class PokemonListPage implements OnInit {
  private pokemonService = inject(PokemonService);
  pokemons: PokemonBasicInfo[] = [];
  loading = true;
  offset = 0;
  limit = 20;

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(loadMore = false): void {
    if (loadMore) this.offset += this.limit;

    this.pokemonService.getPokemons(this.limit, this.offset).subscribe({
      next: (response) => {
        this.pokemons = [...this.pokemons, ...response.results];
        this.loading = false;
      },
      error: (err) => console.error('Erro ao carregar pokémons:', err),
    });
  }

  onInfiniteScroll(ev: Event): void {
    this.loadPokemons(true);
    const infiniteScroll = (ev as CustomEvent).target as HTMLIonInfiniteScrollElement;
    setTimeout(() => infiniteScroll.complete(), 500);
  }

  extractId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}