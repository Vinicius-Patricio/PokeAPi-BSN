import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translateType' })
export class TranslateTypePipe implements PipeTransform {
private translations: { [key: string]: string } = {
    'normal': 'Normal',
    'fire': 'Fogo',
    'water': 'Água',
    'electric': 'Elétrico',
    'grass': 'Grama',
    'ice': 'Gelo',
    'fighting': 'Lutador',
    'poison': 'Veneno',
    'ground': 'Terrestre',
    'flying': 'Voador',
    'psychic': 'Psíquico',
    'bug': 'Inseto',
    'rock': 'Pedra',
    'ghost': 'Fantasma',
    'dragon': 'Dragão',
    'dark': 'Sombrio',
    'steel': 'Metálico',
    'fairy': 'Fada'
};

transform(value: string): string {
    return this.translations[value.toLowerCase()] || value;
}
}