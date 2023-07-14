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
  pokemonsFound!: obtenerPokemons[];
  pokemons: obtenerPokemons[];
  disabledSubmit: boolean;
  inputSearch: string;
  createUpdate: boolean;
  pokemonToUpdate: crearPokemon | undefined;
  pokemonId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private pokemonservice: PokemonsService
    ) {
    this.formularioPokemon = this.registroFormularioPokemon();
    this.pokemons = [];
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
      this.pokemons = allPokemons;
    })
  }

  /**
   * Metodo que llama al servicio de actualizar o crear pokemon dependiendo de si le llega un id o no
   */
  createUpdatePokemon(): void {
    if(this.pokemonId) {
      const modifyPokemon = this.createRequest()
      this.pokemonservice.updatePokemon(modifyPokemon, this.pokemonId).subscribe(updatedPokemons => {
        const indexPokemon = this.pokemonsFound.findIndex(index => index.id == this.pokemonId);
        if(indexPokemon !== -1) this.pokemonsFound[Number(indexPokemon)] = updatedPokemons;
        this.clearFields();
      })
    }
    else {
      const newPokemon = this.createRequest();
      this.pokemonservice.createPokemon(newPokemon).subscribe(createdPokemons => {
        this.clearFields();
        this.pokemonsFound.push(createdPokemons);
      })
    }
    this.pokemons = this.pokemonsFound;
    this.nombre?.markAsUntouched();
    this.imagen?.markAsUntouched();
  }

  /**
   * Metodo que retorna la estructura para crear o actualizar un pokemon
   * @returns crea y retorna la estructura del request de acuerdo a los datos ingresados en el formulario
   */
  createRequest(): crearPokemon {
    return {
      name: this.nombre?.value,
      image: this.imagen?.value,
      attack: this.ataque?.value,
      defense: this.defensa?.value,
      hp: 55,
      type: "Electrico",
      idAuthor: 1
    }
  }

  /**
   * Metodo que llama al servicio para eliminar un pokemon
   * @param id identificador del pokemon que se va a eliminar
   */
  deletePokemon(id?: number): void {
    if(id) {
      this.pokemonservice.deletePokemon(id).subscribe(() => {
        const pokemonIndex = this.pokemonsFound.findIndex(i => i.id === id);
        this.pokemonsFound.splice(pokemonIndex, 1)
    })
  }
  this.pokemons = this.pokemonsFound;
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
      item.name?.toLowerCase().includes(this.inputSearch.toLowerCase())
    );
  }

  /**
   * metodo que muestra la seccion para crear o actualizar un pokemon
   * @param id identificador del pokemon que se desea actualizar
   */
  showAddUpdatePokemon(id?: number): void {
    this.createUpdate = true;
    if(id) {
      this.pokemonId = id;
      this.pokemonToUpdate = this.pokemonsFound.find(objeto => objeto.id === id);
      this.nombre?.setValue(this.pokemonToUpdate?.name);
      this.imagen?.setValue(this.pokemonToUpdate?.image);
      this.ataque?.setValue(this.pokemonToUpdate?.attack);
      this.defensa?.setValue(this.pokemonToUpdate?.defense);
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
