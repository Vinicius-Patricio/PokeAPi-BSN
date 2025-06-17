import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PokemonTypeBadgeComponent } from './pokemon-type-badge.component';

describe('PokemonTypeBadgeComponent', () => {
  let component: PokemonTypeBadgeComponent;
  let fixture: ComponentFixture<PokemonTypeBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PokemonTypeBadgeComponent, ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonTypeBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
