import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonButtons,
  IonToolbar,
  IonCardContent,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardHeader,
  IonCardTitle
} from '@ionic/angular/standalone';
import { PokemonService } from '../services/pokemon.service';
import { PokemonBasicInfo } from '../interfaces/pokemon.interface';
import { TranslateTypePipe } from '../pipes/translate-type.pipe';
import { forkJoin } from 'rxjs';

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
    IonToolbar,
    TranslateTypePipe,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardTitle
  ]
})
export class PokemonListPage implements OnInit {
  private pokemonService = inject(PokemonService);
  
  pokemons: PokemonBasicInfo[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 24;
  totalPokemons = 0;
  totalPages = 0;
  searchTerm = '';
  selectedType = '';
  selectedGeneration = '';
  availableTypes: string[] = [
    'normal', 'fire', 'water', 'electric', 'grass',
    'ice', 'fighting', 'poison', 'ground', 'flying',
    'psychic', 'bug', 'rock', 'ghost', 'dragon',
    'dark', 'steel', 'fairy'
  ];
  availableGenerations: { value: string; label: string }[] = [
    { value: '', label: 'Todas' },
    { value: '1', label: 'Geração 1 (Kanto)' },
    { value: '2', label: 'Geração 2 (Johto)' },
    { value: '3', label: 'Geração 3 (Hoenn)' },
    { value: '4', label: 'Geração 4 (Sinnoh)' },
    { value: '5', label: 'Geração 5 (Unova)' },
    { value: '6', label: 'Geração 6 (Kalos)' },
    { value: '7', label: 'Geração 7 (Alola)' },
    { value: '8', label: 'Geração 8 (Galar)' },
    { value: '9', label: 'Geração 9 (Paldea)' },
    { value: '10', label: 'Geração 10' }
  ];
  filteredPokemons: PokemonBasicInfo[] = [];
  allPokemons: PokemonBasicInfo[] = [];
  searchId = '';
  totalLoadedPokemons = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedPage = +(this.route.snapshot.queryParamMap.get('page') || localStorage.getItem('currentPokemonPage') || 1);
    
    this.currentPage = savedPage;
    this.loadAllPokemons();
  }

  loadAllPokemons(): void {
    if (this.loading) return;
      
    this.loading = true;

    this.pokemonService.getAllPokemons()
    .subscribe({
      next: (pokemons) => {
        this.allPokemons = pokemons;
        this.totalLoadedPokemons = pokemons.length;
        
        const detailObservables = this.allPokemons.map(pokemon => 
          this.pokemonService.getPokemonDetails(pokemon.id)
        );
        
        forkJoin(detailObservables).subscribe(details => {
          details.forEach((detail, index) => {
            this.allPokemons[index].types = detail.types.map(t => t.type.name.toLowerCase());
          });
          
          this.applyFilters();
          this.loading = false;
        });
      },
      error: (err) => {
        console.error('Erro ao carregar pokémons:', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    if (!this.allPokemons) return;

    this.filteredPokemons = this.allPokemons.filter(pokemon => {
      const id = pokemon.id.toString();
      
      return (
        (!this.searchTerm || pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (!this.searchId || id.includes(this.searchId)) &&
        (!this.selectedType || pokemon.types.includes(this.selectedType.toLowerCase())) &&
        (!this.selectedGeneration || pokemon.generation === this.selectedGeneration)
      );
    });

    this.applyPagination();
  }

  applyPagination() {
    this.totalPokemons = this.filteredPokemons.length;
    this.totalPages = Math.ceil(this.totalPokemons / this.pageSize);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pokemons = this.filteredPokemons.slice(startIndex, endIndex);
  }

  loadPage(page: number) {
    this.currentPage = page;
    localStorage.setItem('currentPokemonPage', page.toString());
    
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
    
    this.applyPagination();
  }

  changePage(direction: 'next' | 'prev' ): void {
    const newPage = direction === 'next' ? this.currentPage + 1 : this.currentPage - 1;
    
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.loadPage(newPage);
    }
  }

  goToFirstPage(): void {
    if (this.currentPage !== 1) {
      this.loadPage(1);
    }
  }
  
  goToLastPage(): void {
    if (this.currentPage !== this.totalPages) {
      this.loadPage(this.totalPages);
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

  handleNumberInput(event: any) {
    const input = event.target;
    let value = input.value;
    
    const cleanValue = value.replace(/[^0-9]/g, '');
  
    if (cleanValue !== value) {
      input.value = cleanValue;
      this.searchId = cleanValue;
      input.dispatchEvent(new Event('input'));
    }
    this.applyFilters();
  }

  onNumberKeyPress(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /[0-9]/.test(event.key);
    const isAllowedKey = allowedKeys.includes(event.key);
    
    if (!isNumber && !isAllowedKey) {
      event.preventDefault();
    }
  }

  getPokemonImageUrl(id: string | number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
}