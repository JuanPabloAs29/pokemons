import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { obtenerPokemons } from 'src/models/respuesta-pokemons.model';
import { PokemonsService } from '../../services/pokemons.service';
import { crearPokemon } from '../../models/crear-pokemon.model';

@Component({
  selector: 'app-pokemon-information',
  templateUrl: './pokemon-information.component.html',
  styleUrls: ['./pokemon-information.component.scss']
})
export class PokemonInformationComponent implements OnInit {

  formularioPokemon: FormGroup;
  pokemonsFound: obtenerPokemons[] = [
    {id: '0', nombre: 'Ivysaur', imagen: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/002.png', ataque: 65, defensa: 38 },
    {id: '1', nombre: 'Pikachu', imagen: 'https://static.wikia.nocookie.net/vsbattles/images/0/04/025Pikachu_XY_anime_4.png', ataque: 80, defensa: 20 },
    {id: '2', nombre: 'Charizard', imagen: 'https://images.wikidexcdn.net/mwuploads/wikidex/thumb/9/95/latest/20160817212623/Charizard.png/1200px-Charizard.png', ataque: 10, defensa: 90 }
  ];
  pokemons: obtenerPokemons[];
  disabledSubmit: boolean;
  inputSearch: string;
  createUpdate: boolean;
  pokemonToUpdate: crearPokemon | undefined;
  pokemonId: string | undefined;

  constructor(
    private fb: FormBuilder,
    private pokemonservice: PokemonsService
    ) {
    this.formularioPokemon = this.registroFormularioPokemon();
    this.pokemons = this.pokemonsFound;
    this.disabledSubmit = true;
    this.inputSearch = '';
    this.createUpdate = false;
    this.pokemonToUpdate = undefined;
   }

  ngOnInit(): void {
    this.getPokemons();
  }

  registroFormularioPokemon(): FormGroup {
    return this.fb.group({
      nombre: new FormControl('', Validators.required),
      imagen: new FormControl('', Validators.required),
      ataque: new FormControl(0),
      defensa: new FormControl(0)
    })
  }

  /**
   * Llamado al servicio que obtiene todos los pokemon
   */
  getPokemons(): void {
    this.pokemonservice.getAllPokemons().subscribe(allPokemons => {
      this.pokemonsFound = allPokemons;
    })
  }

  /**
   * Metodo que llama al servicio de actualizar o crear pokemon dependiendo de si le llega un id o no
   */
  createUpdatePokemon(): void {
    if(this.pokemonId) {
      const updatePokemon: crearPokemon = {
        id: this.pokemonId,
        nombre: this.nombre?.value,
        imagen: this.imagen?.value,
        ataque: this.ataque?.value,
        defensa: this.defensa?.value
      }
      const indexPokemon = this.pokemonsFound.findIndex(i => i.id == this.pokemonId);
      if(indexPokemon !== -1) this.pokemonsFound[Number(this.pokemonId)] = updatePokemon;
      this.pokemonservice.updatePokemon(updatePokemon, this.pokemonId).subscribe(updatedPokemons => {
        // this.pokemonsFound = updatedPokemons;
      })
    }
    else {
      const newPokemon: crearPokemon = {
        nombre: this.nombre?.value,
        imagen: this.imagen?.value,
        ataque: this.ataque?.value,
        defensa: this.defensa?.value
      }
      this.pokemonsFound.push(newPokemon);
      console.log('pasa por aca: ', this.pokemonsFound);
      this.pokemonservice.createPokemon(newPokemon).subscribe(createdPokemons => {
        // this.pokemonsFound = createdPokemons;
      })
    }
    this.clearFields();
    this.nombre?.markAsUntouched();
    this.imagen?.markAsUntouched();
  }

  /**
   * Metodo que llama al servicio para eliminar un pokemon
   * @param id identificador del pokemon que se va a eliminar
   */
  deletePokemon(id?: string): void {
    if(id) {
      const pokemonIndex = this.pokemonsFound.findIndex(i => i.id === id);
      this.pokemonsFound.splice(pokemonIndex, 1)
      this.pokemonservice.deletePokemon(id).subscribe(deletedPokemon => {
      // this.pokemonsFound = deletedPokemon;
    })
  }
  }

  /**
   * valida si debe habilitar o deshabilitar el boton de guardar
   */
  validateEnableButton(): void {
    this.nombre?.value && this.imagen?.value ? this.disabledSubmit = false : this.disabledSubmit = true;
  }

  /**
   * valida si el campo de nombre es valido o invalido al hacer clic sobre el y perder el foco
   * @returns retorna un valor de true si es invalido y false si es valido
   */
  validateNameInput(): boolean | undefined {
    return this.nombre?.invalid && this.nombre?.touched;
  }

  /**
   * valida si el campo de imagen es valido o invalido al hacer clic sobre el y perder el foco
   * @returns retorna un valor de true si es invalido y false si es valido
   */
  validateImageInput(): boolean | undefined {
    return this.imagen?.invalid && this.imagen?.touched;
  }

  /**
   * realiza el filtro y busca los pokemon en la tabla por nombre
   */
  searchPokemon(): void {
    this.pokemonsFound = this.pokemons.filter(item =>
      item.nombre.toLowerCase().includes(this.inputSearch.toLowerCase())
    );
  }

  /**
   * metodo que muestra la seccion para crear o actualizar un pokemon
   * @param id identificador del pokemon que se desea actualizar
   */
  addUpdatePokemon(id?: string): void {
    this.createUpdate = true;
    if(id) {
      this.pokemonId = id;
      this.pokemonToUpdate = this.pokemonsFound.find(objeto => objeto.id === id);
      this.nombre?.setValue(this.pokemonToUpdate?.nombre);
      this.imagen?.setValue(this.pokemonToUpdate?.imagen);
      this.ataque?.setValue(this.pokemonToUpdate?.ataque);
      this.defensa?.setValue(this.pokemonToUpdate?.defensa);
      this.validateEnableButton();
    }
    else {
      this.clearFields();
      this.nombre?.markAsUntouched();
      this.imagen?.markAsUntouched();
    }
  }

  /**
   * metodo que cierra la sección para crear o actualizar un pokemon
   */
  cancelAction(): void {
    this.createUpdate = false;
  }

  /**
   * metodo que limpia los campos de la sección para actualizar o crear un pokemon
   */
  clearFields(): void {
    this.nombre?.setValue('');
    this.imagen?.setValue('');
    this.ataque?.setValue(0);
    this.defensa?.setValue(0);
    this.disabledSubmit = true;
    this.pokemonId = undefined;
  }
  
  get nombre() {return this.formularioPokemon.get('nombre')};
  get imagen() {return this.formularioPokemon.get('imagen')};
  get ataque() {return this.formularioPokemon.get('ataque')};
  get defensa() {return this.formularioPokemon.get('defensa')};

}
