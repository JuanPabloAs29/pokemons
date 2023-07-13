import { crearPokemon } from './crear-pokemon.model';

export interface obtenerPokemons extends crearPokemon {
    id?: string;
}