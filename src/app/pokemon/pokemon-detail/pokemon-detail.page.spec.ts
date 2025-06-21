import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonDetailPage } from './pokemon-detail.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('PokemonDetailPage', () => {
  let component: PokemonDetailPage;
  let fixture: ComponentFixture<PokemonDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar lista de detalhes', () => {
    expect(component).toBeTruthy();
  });
});
