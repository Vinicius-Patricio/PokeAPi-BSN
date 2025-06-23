import { TestBed } from '@angular/core/testing';
import { PokemonTypeBadgeComponent } from './pokemon-type-badge.component';

describe('PokemonTypeBadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonTypeBadgeComponent]
    }).compileComponents();
  });

  it('deve tester o tipo do pokemon', () => {
    const fixture = TestBed.createComponent(PokemonTypeBadgeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
