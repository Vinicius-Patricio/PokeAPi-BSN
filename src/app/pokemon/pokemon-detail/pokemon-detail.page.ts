import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { PokemonService } from '../services/pokemon.service';
import { TranslateTypePipe } from '../pipes/translate-type.pipe';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    UpperCasePipe,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonSpinner,
    TranslateTypePipe
  ]
})
export class PokemonDetailPage implements OnInit {
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private favoritesService = inject(FavoritesService);

  pokemon: any = null;
  loading = true;
  error = false;
  evolutionChain: any = null;
  evolutions: any[] = [];
  previousPokemon: number | null = null;
  nextPokemon: number | null = null;

  ngOnInit(): void {
    const pokemonId = this.route.snapshot.paramMap.get('id');
    if (pokemonId) {
      this.loadPokemonDetails(pokemonId);
    }
  }

  loadPokemonDetails(id: string): void {
    this.loading = true;
    this.error = false;

    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.previousPokemon = pokemon.id > 1 ? pokemon.id - 1 : null;
        this.nextPokemon = pokemon.id < 1010 ? pokemon.id + 1 : null;
        
        this.loadPokemonSpecies(id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar detalhes do Pokémon:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadPokemonSpecies(id: string): void {
    this.pokemonService.getPokemonSpecies(id).subscribe({
      next: (species) => {
        if (species.evolution_chain?.url) {
          this.loadEvolutionChain(species.evolution_chain.url);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar espécie do Pokémon:', err);
      }
    });
  }

  loadEvolutionChain(url: string): void {
    this.pokemonService.getEvolutionChain(url).subscribe({
      next: (chain) => {
        this.evolutionChain = chain;
        this.evolutions = this.parseEvolutionChain(chain.chain);
      },
      error: (err) => {
        console.error('Erro ao carregar cadeia de evolução:', err);
      }
    });
  }

  parseEvolutionChain(chain: any): any[] {
    const evolutions: any[] = [];
    
    const addEvolution = (evolution: any) => {
      evolutions.push({
        id: this.extractIdFromUrl(evolution.species.url),
        name: evolution.species.name,
        isCurrent: evolution.species.name === this.pokemon?.name
      });
      
      if (evolution.evolves_to && evolution.evolves_to.length > 0) {
        evolution.evolves_to.forEach((next: any) => addEvolution(next));
      }
    };
    
    addEvolution(chain);
    return evolutions;
  }

  extractIdFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2];
  }

  getGenerationName(generation: string): string {
    const generations: { [key: string]: string } = {
      '1': 'Kanto',
      '2': 'Johto',
      '3': 'Hoenn',
      '4': 'Sinnoh',
      '5': 'Unova',
      '6': 'Kalos',
      '7': 'Alola',
      '8': 'Galar',
      '9': 'Paldea',
      '10': 'Geração 10'
    };
    return generations[generation] || generation;
  }

  getTypeColor(typeName: string): string {
    const typeColors: { [key: string]: string } = {
      'normal': '#A8A878',
      'fire': '#F08030',
      'water': '#6890F0',
      'electric': '#F8D030',
      'grass': '#78C850',
      'ice': '#98D8D8',
      'fighting': '#C03028',
      'poison': '#A040A0',
      'ground': '#E0C068',
      'flying': '#A890F0',
      'psychic': '#F85888',
      'bug': '#A8B820',
      'rock': '#B8A038',
      'ghost': '#705898',
      'dragon': '#7038F8',
      'dark': '#705848',
      'steel': '#B8B8D0',
      'fairy': '#EE99AC'
    };
    return typeColors[typeName.toLowerCase()] || '#A8A878';
  }

  getPrimaryType(): string {
    if (this.pokemon && this.pokemon.types && this.pokemon.types.length > 0) {
      return this.pokemon.types[0].type.name;
    }
    return 'normal';
  }

  getBackgroundStyle(): string {
    if (!this.pokemon || !this.pokemon.types) {
      return `linear-gradient(135deg, ${this.getTypeColor('normal')} 0%, ${this.getTypeColor('normal')}cc 50%, ${this.getTypeColor('normal')}99 100%)`;
    }

    const primaryType = this.pokemon.types[0].type.name;
    const primaryColor = this.getTypeColor(primaryType);

    if (this.pokemon.types.length === 1) {
      return `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 50%, ${primaryColor}99 100%)`;
    } else {
      const secondaryType = this.pokemon.types[1].type.name;
      const secondaryColor = this.getTypeColor(secondaryType);
      return `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 30%, ${secondaryColor}cc 70%, ${secondaryColor}99 100%)`;
    }
  }

  getPokemonImageUrl(id: string): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/logo-pokemon.png';
  }

  goBack(): void {
    this.router.navigate(['/pokemon']);
  }

  goToPokemon(id: number): void {
    this.router.navigate(['/pokemon', id]);
  }

  goToPrevious(): void {
    if (this.previousPokemon) {
      this.goToPokemon(this.previousPokemon);
    }
  }

  goToNext(): void {
    if (this.nextPokemon) {
      this.goToPokemon(this.nextPokemon);
    }
  }

  toggleFavorite(id: number): void {
    this.favoritesService.toggleFavorite(id);
  }

  isFavorite(id: number): boolean {
    return this.favoritesService.isFavorite(id);
  }
  
}