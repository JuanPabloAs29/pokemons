import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { FormBuilder, FormsModule } from '@angular/forms';

import { PokemonInformationComponent } from './pokemon-information.component';
import { PokemonsService } from '../../services/pokemons.service';
import { of } from 'rxjs';

describe('PokemonInformationComponent', () => {
  let component: PokemonInformationComponent;
  let fixture: ComponentFixture<PokemonInformationComponent>;
  let pokemonsService: PokemonsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonInformationComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PokemonsService, FormBuilder, FormsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    pokemonsService = TestBed.inject(PokemonsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia obtener todos los pokemon', () => {
    const response = [
      {name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40},
      {name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40}
    ]
    const spyGetPokemons = jest.spyOn(pokemonsService, 'getAllPokemons').mockReturnValue(of(response));
    component.getPokemons();
    expect(spyGetPokemons).toHaveBeenCalled();
  })

  it('deberia actualizar un pokemon', () => {
    component.pokemonId = 1
    component.pokemonsFound = [
      {id: 1, name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40},
      {id: 2, name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40}
    ]
    const response = {id: 1, name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40}
    const spyUpdatePokemon = jest.spyOn(pokemonsService, 'updatePokemon').mockReturnValue(of(response));
    component.createUpdatePokemon();
    expect(spyUpdatePokemon).toHaveBeenCalled();
  })

  it('np deberia encontrar el id para actualizar el pokemon', () => {
    component.pokemonId = 3
    component.pokemonsFound = [
      {id: 1, name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40},
      {id: 2, name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40}
    ]
    const response = {id: 1, name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40}
    const spyUpdatePokemon = jest.spyOn(pokemonsService, 'updatePokemon').mockReturnValue(of(response));
    component.createUpdatePokemon();
    expect(spyUpdatePokemon).toHaveBeenCalled();
  })

  it('deberia crear un pokemon', () => {
    const response = {name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40};
    const spyCreatePokemon = jest.spyOn(pokemonsService, 'createPokemon').mockReturnValue(of(response));
    const spyClearField = jest.spyOn(component, 'clearFields').mockImplementation();
    component.createUpdatePokemon();
    expect(spyCreatePokemon).toHaveBeenCalled();
    expect(spyClearField).toHaveBeenCalled();
  })

  it('deberia crear la estructura del request', () => {
    component.nombre?.setValue('Pikachu');
    component.imagen?.setValue('www.google.com');
    component.ataque?.setValue(30);
    component.defensa?.setValue(70);
    const req = {
      name: 'Pikachu',
      image: 'www.google.com',
      attack: 30,
      defense: 70,
      hp: 55,
      type: "Electrico",
      idAuthor: 1
    }
    const spyCreateReq = component.createRequest();
    expect(spyCreateReq).toEqual(req);
  })

  it('deberia eliminar un pokemon', () => {
    component.pokemonsFound = [
      {id: 1, name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40},
      {id: 2, name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40}
    ]
    const spyGetPokemons = jest.spyOn(pokemonsService, 'deletePokemon').mockReturnValue(of({}));
    component.deletePokemon(1);
    expect(spyGetPokemons).toHaveBeenCalled();
  })

  it('deberia habilitar el boton de enviar', () => {
    component.nombre?.setValue('Pikachu');
    component.imagen?.setValue('www.google.com');
    component.validateEnableButton();
    expect(component.disabledSubmit).toBeFalsy();
  })

  it('deberia deshabilitar el boton de enviar', () => {
    component.nombre?.setValue('');
    component.imagen?.setValue('www.google.com');
    component.validateEnableButton();
    expect(component.disabledSubmit).toBeTruthy();
  })

  it('deberia validar el input del name y retornar un valido', () => {
    component.nombre?.setValue('Pikachu');
    const spyValidate = component.validateNameInput();
    expect(spyValidate).toBeFalsy();
  })

  it('deberia validar el input del name y retornar un invalido', () => {
    component.nombre?.markAsTouched();
    const spyValidate = component.validateNameInput();
    expect(spyValidate).toBeTruthy();
  })

  it('deberia validar el input de la image y retornar un valido', () => {
    component.imagen?.setValue('Pikachu');
    const spyValidate = component.validateImageInput();
    expect(spyValidate).toBeFalsy();
  })

  it('deberia validar el input de la image y retornar un invalido', () => {
    component.imagen?.markAsTouched();
    const spyValidate = component.validateImageInput();
    expect(spyValidate).toBeTruthy();
  })

  it('deberia realizar el filtro de busqueda y encontrar resultados', () => {
    const res = {name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40};
    component.pokemons = [
      {name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40},
      {name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40}
    ];
    component.inputSearch = 'Pikachu';
    component.searchPokemon();
    expect(component.pokemonsFound).toEqual([res]);
  })

  it('deberia realizar el filtro de busqueda y no encontrar resultados', () => {
    component.pokemons = [
      {name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40},
      {name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40}
    ];
    component.inputSearch = 'Charizard';
    component.searchPokemon();
    expect(component.pokemonsFound).toEqual([]);
  })

  it('deberia obtener los datos para actualizar el pokemon', () => {
    const spyClearFileds = jest.spyOn(component, 'clearFields').mockImplementation();
    component.pokemonsFound = [
      {id: 0, name: 'Pikachu', image: 'www.google.com', attack: 30, defense: 40},
      {id: 1, name: 'Bulbasur', image: 'www.google.com', attack: 30, defense: 40}
    ];
    component.showAddUpdatePokemon(1)
    expect(component.nombre?.value).toEqual('Bulbasur');
    expect(component.imagen?.value).toEqual('www.google.com');
    expect(component.ataque?.value).toEqual(30);
    expect(component.defensa?.value).toEqual(40);
    expect(spyClearFileds).not.toHaveBeenCalled();
  })

  it('deberia llamar al metodo para limpiar todos los campos del formulario', () => {
    const spyClearFileds = jest.spyOn(component, 'clearFields').mockImplementation();
    component.showAddUpdatePokemon();
    expect(spyClearFileds).toHaveBeenCalled();
  })

  it('deberia cancelar y ocultar la seccion de crear y actualziar', () => {
    component.cancelAction();
    expect(component.createUpdate).toBeFalsy();
  })

  it('deberia limpiar los campos del formulario y deshabilitar el boton de enviar', () => {
    component.clearFields();
    expect(component.nombre?.value).toEqual('');
    expect(component.imagen?.value).toEqual('');
    expect(component.ataque?.value).toEqual(0);
    expect(component.defensa?.value).toEqual(0);
    expect(component.disabledSubmit).toBeTruthy();
    expect(component.pokemonId).toEqual(undefined);
  })

});
