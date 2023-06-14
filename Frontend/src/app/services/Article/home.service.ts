import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnseignant, IEtudiant, IHome, IProjet } from 'src/app/Home';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient ) {
  }

  getProjet(): Observable<IHome[]> {
    return this.http.get<IHome[]>("http://localhost:3500/Enseignant/Projet/AfficherAllProjet");
  }

  getUser(id: string): Observable<IEtudiant[]>{
    return this.http.get<IEtudiant[]>("http://localhost:3500/Etudiant/Afficher/"+id);
  }

  getEns(id: string): Observable<IEnseignant[]>{
    return this.http.get<IEnseignant[]>("http://localhost:3500/Enseignant/Afficher/"+id);
  }

  getAdmin(id: string): Observable<IEnseignant[]>{
    return this.http.get<IEnseignant[]>("http://localhost:3500/Administrateur/Afficher/"+id);
  }



  getAllEns(): Observable<IEnseignant[]>{
    return this.http.get<IEnseignant[]>("http://localhost:3500/Enseignant/AffihcerTousEnseignant");
  }

  getAllEtud(): Observable<IEtudiant[]>{
    return this.http.get<IEtudiant[]>("http://localhost:3500/Etudiant/AfficherAllEtudiant");
  }


  getDetailsProject(id: string): Observable<IProjet[]>{
    return this.http.get<IProjet[]>("http://localhost:3500/Enseignant/Projet/ProjetDetails/"+id);
  }

  getTokenEtudiant() {
    let tokenEtud = sessionStorage.getItem('Etudiant')!;
    let decodedToken = jwt_decode(tokenEtud) as { id: any };
    let id = decodedToken.id;
    return id;
  }

  getTokenEnseignant() {
    let tokenEns = sessionStorage.getItem('Enseignant')!;
    let decodedToken = jwt_decode(tokenEns) as { id: any };
    let id = decodedToken.id;
    return id;
  }

  getTokenAdministrateur() {
    let tokenAdmin = sessionStorage.getItem('Administrateur')!;
    let decodedToken = jwt_decode(tokenAdmin) as { id: any };
    let id = decodedToken.id;
    return id;
  }

}

