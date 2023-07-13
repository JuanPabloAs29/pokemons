import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { PokemonInformationComponent } from './pokemon-information/pokemon-information.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pokemons-info', pathMatch: 'full'
  },
  {
    path: 'pokemons-info',
    component: PokemonInformationComponent
  },
  {
    path: '**',
    component: NotFoundComponent,
    loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule)

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
