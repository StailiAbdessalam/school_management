import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/Article/home/home.component';
import { MesProjetsComponent } from './components/Article/mes-projets/mes-projets.component';
import { ProfileComponent } from './components/Article/profile/profile.component';
import { LandingPageComponent } from './components/partials/landing-page/landing-page.component';
import { ProjetDetailsComponent } from './components/Article/projet-details/projet-details.component';
import { CreateComponent } from './components/Article/Crud-Projet/create/create.component';
import { VisualiserComponent } from './components/Article/Crud-Admin/Read/visualiser/visualiser.component';
import { ModifierComponent } from './components/Article/Crud-Admin/Read/modifier/modifier.component';
import { UpdateComponent } from './components/Article/Crud-Projet/update/update.component';

// le routes de url dans le front
const routes: Routes = [

  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'MesProjet',
    component: MesProjetsComponent ,
  },
  {
    path: 'Profile',
    component: ProfileComponent ,
  },
  {
    path: 'ProjetDetails/:id',
    component: ProjetDetailsComponent
  },
  {
    path: 'MesProjet/Projet/Create',
    component: CreateComponent
  },
  {
    path: 'utilisateur/:id/:role',
    component: VisualiserComponent
  },
  {
    path: 'Modifier/:role/:id',
    component: ModifierComponent
  },
  {
    path: 'Projet/modifier/:id',
    component: UpdateComponent
  }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
