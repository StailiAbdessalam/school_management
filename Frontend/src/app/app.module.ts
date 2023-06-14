import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/Fixed/header/header.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/Fixed/sidebar/sidebar.component';
import { HomeComponent } from './components/Article/home/home.component';
import { MesProjetsComponent } from './components/Article/mes-projets/mes-projets.component'
import { LogoutComponent } from './components/Fixed/logout/logout.component';
import { ProfileComponent } from './components/Article/profile/profile.component';
import { LandingPageComponent } from './components/partials/landing-page/landing-page.component';
import { ProjetDetailsComponent } from './components/Article/projet-details/projet-details.component';
import { CreateComponent } from './components/Article/Crud-Projet/create/create.component';
import { UpdateComponent } from './components/Article/Crud-Projet/update/update.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VisualiserComponent } from './components/Article/Crud-Admin/Read/visualiser/visualiser.component';
import { ModifierComponent } from './components/Article/Crud-Admin/Read/modifier/modifier.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    MesProjetsComponent,
    LogoutComponent,
    ProfileComponent,
    ProjetDetailsComponent,
    CreateComponent,
    UpdateComponent,
    VisualiserComponent,
    ModifierComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
