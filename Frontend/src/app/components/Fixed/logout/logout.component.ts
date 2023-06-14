import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent {
  decodedToken: any;
  TokenDecode: any;


  constructor(private router: Router, private http: HttpClient) {}



  logout() {

    let tokenAdmin = sessionStorage.getItem('Administrateur')
    let tokenEns = sessionStorage.getItem('Enseignant')
    let tokenEtud = sessionStorage.getItem('Etudiant')


    if(tokenAdmin)
    {
      this.http.post("http://localhost:3500/Administrateur/Logout", {}).subscribe((resultData: any) => {
        // Faire quelque chose avec les données de résultat

        // Supprimer les tokens depuis la session storage
        window.sessionStorage.removeItem('Administrateur');

        // Rediriger vers la page d'accueil
        this.router.navigateByUrl('');
      });
    }
    if(tokenEns)
    {
      this.http.post("http://localhost:3500/Enseignant/Logout", {}).subscribe((resultData: any) => {
        // Faire quelque chose avec les données de résultat

        // Supprimer les tokens depuis la session storage
        window.sessionStorage.removeItem('Enseignant');

        // Rediriger vers la page d'accueil
        this.router.navigateByUrl('');
      });
    }
    if(tokenEtud)
    {
      this.http.post("http://localhost:3500/Etudiant/Logout", {}).subscribe((resultData: any) => {
        window.sessionStorage.removeItem('Etudiant');

        this.router.navigateByUrl('');
      });
    }

  }
}
