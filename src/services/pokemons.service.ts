import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { obtenerPokemons } from 'src/models/respuesta-pokemons.model';
import { crearPokemon } from 'src/models/crear-pokemon.model';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {

  constructor(private http: HttpClient) { }

  /**
   * metodo que consulta al servicio y obtiene los pokemon mediante un metodo GET
   * @returns retorna un observable con el arreglo de los pokemons
   */
  getAllPokemons(): Observable<obtenerPokemons[]> {
    return this.http.get<obtenerPokemons[]>(environment.urlApiPokemon);
  }

  /**
   * método que genera una petición al servicio para crear un pokemon mediante el método POST
   * @param newPokemon request con los datos para crear el nuevo pokemon
   * @returns retorna un observable con el nuevo arreglo de pokemon
   */
  createPokemon(newPokemon: crearPokemon): Observable<obtenerPokemons[]> {
    return this.http.post<obtenerPokemons[]>(environment.urlApiPokemon, newPokemon);
  }

  /**
   * método que genera una petición de tipo PUT para actualizar un pokemon
   * @param pokemon request con los datos del pokemon que se va a actualizar
   * @param id identificador del pokemon que se va a actualziar
   * @returns retorna un observable con el nuevo arreglo de pokemons
   */
  updatePokemon(pokemon: crearPokemon, id: string): Observable<obtenerPokemons[]> {
    return this.http.put<obtenerPokemons[]>(`${environment.urlApiPokemon}:${id}`, pokemon);
  }

  /**
   * método que genera una petición de tipo DELETE para eliminar un pokemon
   * @param id identificador del pokemos que se va a eliminar
   * @returns retorna un observable con el nuevo arreglo de pokemons
   */
  deletePokemon(id: string): Observable<obtenerPokemons[]> {
    return this.http.delete<obtenerPokemons[]>(`${environment.urlApiPokemon}:${id}`);
  }
}
