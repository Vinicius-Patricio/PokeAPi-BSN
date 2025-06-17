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
  IonCardContent
} from '@ionic/angular/standalone';
import { PokemonService } from '../services/pokemon.service';
import { PokemonBasicInfo } from '../interfaces/pokemon.interface';
import { TranslateTypePipe } from '../pipes/translate-type.pipe';

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
    TranslateTypePipe
  ]
})
export class PokemonListPage implements OnInit {
  private pokemonService = inject(PokemonService);
  
  pokemons: PokemonBasicInfo[] = [];
  loading = false;
  currentPage = 1;
  offset = 0;
  pageSize = 24;
  hasMore= true;
  totalPokemons = 0;
  totalPages = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedPage = +(this.route.snapshot.queryParamMap.get('page') || localStorage.getItem('currentPokemonPage') || 1);
    
    this.currentPage = savedPage;
    this.loadPokemons();
  }

  loadPokemons(): void {
    if (this.loading) return;
      
    this.loading = true;
    const offset = (this.currentPage - 1) * this.pageSize;

    this.pokemonService.getPokemons(this.pageSize, offset)
    .subscribe({
      next: (response) => {
        this.pokemons = response.results.map(pokemon => ({...pokemon,
          id: this.extractId(pokemon.url),
          types: []
        }));
        
        this.pokemons.forEach(pokemon => {
          this.pokemonService.getPokemonDetails(pokemon.id).subscribe(details => {
            pokemon.types = details.types.map(t => t.type.name.toLowerCase());
            console.log(pokemon.name, pokemon.types);
          });
        });

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
  
  loadPage(page: number) {
    this.currentPage = page;
    localStorage.setItem('currentPokemonPage', page.toString());
    
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
    
    this.loadPokemons();
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
}