import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'src/app/services/Article/home.service';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  id: any;
  DetailsProjet: any;
  tabCompetences: string[] = [];
  tabPrerequis: string[] = [];
  decodedToken: any
  TokenDecode: any

  descriptionProjet: string = '';
  nomProjet: string = '';

  constructor(
    private homeService: HomeService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    let tokenEns = sessionStorage.getItem('Enseignant');

    if(tokenEns)
    {
      this.decodedToken = jwt_decode(tokenEns);
      this.TokenDecode = this.decodedToken.id
      this.id = this.TokenDecode._id
    }
  }

  ajouterCompetence() {
    const inputElement = document.getElementById('nomCompetences') as HTMLInputElement;
    const nouvelleCompetence = inputElement.value;
    if (nouvelleCompetence) {
      this.tabCompetences.push(nouvelleCompetence);
      inputElement.value = '';
    }
  }

  supprimerCompetence(index: number) {
    this.tabCompetences.splice(index, 1);
  }

  ajouterPrerequis() {
    const inputElement = document.getElementById('prerequis') as HTMLInputElement;
    const nouvellePrerequis = inputElement.value;
    if (nouvellePrerequis) {
      this.tabPrerequis.push(nouvellePrerequis);
      inputElement.value = '';
    }
  }

  supprimerPrerequis(index: number) {
    this.tabPrerequis.splice(index, 1);
  }

  enregistrerProjet() {

    let bodyData = {
      'nom': this.nomProjet,
      'description': this.descriptionProjet,
      'competences': this.tabCompetences,
      'prerequis': this.tabPrerequis
    };

    this.http
      .post('http://localhost:3500/Enseignant/Projet/AjouterProjet/'+ this.id, bodyData)
      .subscribe(
        (resultData: any) => {
          if (resultData) {
            Swal.fire({
              icon: 'success',
              title: 'Le projet a bien été créé',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigateByUrl('/MesProjet');
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.error.message
          });
        }
      );
  }
}
