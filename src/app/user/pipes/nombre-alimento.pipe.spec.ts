import { NombreAlimentoPipe } from './nombre-alimento.pipe';

describe('NombreAlimentoPipe', () => {
  it('create an instance', () => {
    const pipe = new NombreAlimentoPipe();
    expect(pipe).toBeTruthy();
  });
});
