import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonList, 
  IonItem, 
  IonAvatar, 
  IonLabel,
  IonButton,
  IonButtons,
  IonToolbar,
  IonCardContent
} from '@ionic/angular/standalone';
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
    RouterModule,
    UpperCasePipe,
    IonContent,
    IonCardContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonButton,
    IonButtons,
    IonToolbar
  ]
})
export class PokemonListPage implements OnInit {
  private pokemonService = inject(PokemonService);
  pokemons: PokemonBasicInfo[] = [];
  loading = false;
  currentPage = 1;
  offset = 0;
  pageSize = 20;
  hasMore= true;
  totalPokemons = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.loadPokemons();
  }

  loadPokemons(): void {
    if (this.loading) return;
      
    this.loading = true;
    const offset = (this.currentPage - 1) * this.pageSize;

    this.pokemonService.getPokemons(this.pageSize, offset)
    .subscribe({
      next: (response) => {
        this.pokemons = response.results;
        this.totalPokemons = response.count;
        this.totalPages = Math.ceil(this.totalPokemons / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pokémons:', err);
        this.loading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPokemons();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPokemons();
    }
  }

  extractId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '';
  }
}