import { TranslateTypePipe } from './translate-type.pipe';

describe('TranslateTypePipe', () => {
    const pipe = new TranslateTypePipe();

    it('deve traduzir "fire" para "Fogo"', () => {
        expect(pipe.transform('fire')).toBe('Fogo');
    });

    it('deve traduzir "water" para "Água"', () => {
        expect(pipe.transform('water')).toBe('Água');
    });

    it('deve retornar o valor original se não houver tradução', () => {
        expect(pipe.transform('unknown')).toBe('unknown');
    });
});