import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'src/app/services/Article/home.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  id: any;
  DetailsProjet: any;
  tabCompetences: string[] = [];
  tabPrerequis: string[] = [];
  description: string = '';
  nomProjet: string = '';

  constructor(
    private homeServices: HomeService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.homeServices.getDetailsProject(this.id).subscribe((data: any) => {
        this.DetailsProjet = data;
        this.nomProjet = this.DetailsProjet.nom
        this.description = this.DetailsProjet.description
        this.tabCompetences = this.DetailsProjet.competences || [];
        this.tabPrerequis = this.DetailsProjet.prerequis || [];
      });
    });
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

  Enregister()
  {

    let bodyData = {
      'nom': this.nomProjet,
      'description': this.description,
      'competences': this.tabCompetences,
      'prerequis': this.tabPrerequis
    };

    this.http
      .put('http://localhost:3500/Enseignant/Projet/Update/'+ this.id, bodyData)
      .subscribe(
        (resultData: any) => {
          if (resultData) {
            Swal.fire({
              icon: 'success',
              title: 'Le projet a bien été modifier',
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
            text: error.error
          });
        }
      );
  }
}
