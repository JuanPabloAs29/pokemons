import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../environments/environment'

import { PokemonsService } from './pokemons.service';

describe('PokemonsService', () => {
  let service: PokemonsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    });
    service = TestBed.inject(PokemonsService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deberia obtener todos los pokemon', () => {
    const response = [
      { name: 'Pikachu', image: 'www.google.com' },
      { name: 'Charizard', image: 'www.google.com' }
    ];

    service.getAllPokemons().subscribe(pokemons => {
      expect(pokemons).toEqual(response);
    });

    const req = httpMock.expectOne(environment.urlApiPokemon+'/?idAuthor=1');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('deberia crear un pokemon', () => {
    const request = {name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 30};
    service.createPokemon(request).subscribe(data => {
      expect(data).toEqual(request);
    })
    const req = httpMock.expectOne(environment.urlApiPokemon);
    expect(req.request.method).toBe('POST');
    req.flush(request);
  })

  it('deberia actualizar un pokemon', () => {
    const request = {name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 30};
    service.updatePokemon(request, 1).subscribe(data => {
      expect(data).toEqual(request);
    })
    const req = httpMock.expectOne(environment.urlApiPokemon+'/1');
    expect(req.request.method).toBe('PUT');
    req.flush(request);
  })

  it('deberia eliminar un pokemon', () => {
    service.deletePokemon(1).subscribe(data => {
      expect(data).toEqual('success');
    })
    const req = httpMock.expectOne(environment.urlApiPokemon+'/1');
    expect(req.request.method).toBe('DELETE');
    req.flush('success');
  })

});
