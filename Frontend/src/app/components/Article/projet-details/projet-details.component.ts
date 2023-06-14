import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/Article/home.service';
import jwt_decode from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.css']
})
export class ProjetDetailsComponent implements OnInit {

  DetailsProjet: any;
  id: any;
  idEtudiant: any;
  InfoEtudiant: any;
  idProjetInscrit: any[] = [];
  idProjetFavoris: any[] = [];
  competencesProjet: any[] = [];
  isInscrit: boolean = false;
  isFavorit: boolean = false;
  TokenDecode: any;
  decodedToken: any;
  constructor(
    private homeServices: HomeService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.stat()
    let tokenEns = sessionStorage.getItem('Enseignant');
    let tokenEtud = sessionStorage.getItem('Etudiant');

    if (tokenEns) {
      this.decodedToken = jwt_decode(tokenEns);
      this.TokenDecode = this.decodedToken.id;
    }
    if (tokenEtud) {
      this.decodedToken = jwt_decode(tokenEtud);
      this.TokenDecode = this.decodedToken.id;
    }

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.homeServices.getDetailsProject(this.id).subscribe((data: any) => {
        this.DetailsProjet = data;
      });
    });

    this.idEtudiant = this.homeServices.getTokenEtudiant()._id;

    this.homeServices.getUser(this.idEtudiant).subscribe((data: any) => {
      this.InfoEtudiant = data;
      this.idProjetInscrit = this.InfoEtudiant.projetInscrit.map((projet: any) => projet.projet._id);
      this.isInscrit = this.idProjetInscrit.includes(this.id);

      this.competencesProjet = this.getCompetencesAndProgression(this.id); // Appel de la fonction pour récupérer les compétences du projet
    });

    this.checkFavorite();
  }

  getCompetencesAndProgression(projetId: string): any[] {
    const projetInscrit = this.InfoEtudiant.projetInscrit.find((projet: any) => projet.projet._id === projetId);
    if (projetInscrit) {
      return projetInscrit.competences.map((competence: any) => ({
        nom: competence.nom,
        progression: competence.progression,
        id: competence._id
      }));
    }
    return [];
  }
  Inscrire(idProjet: any)
  {
        this.idEtudiant = this.homeServices.getTokenEtudiant()._id;

    this.http.put("http://localhost:3500/Etudiant/inscrire/"+ this.idEtudiant, {idProjet}).subscribe((resultData: any) => {
        if (resultData) {

          alert("Changement sont bien éffectué")
          location.reload();
        } else {
          alert('Incorrect password')
        }
      });
  }

  Desinscrire(idProjet: any)
  {
        this.idEtudiant = this.homeServices.getTokenEtudiant()._id;

    this.http.put("http://localhost:3500/Etudiant/Desinscrire/"+ this.idEtudiant, {idProjet}).subscribe((resultData: any) => {
        if (resultData) {

          alert("Changement sont bien éffectué")
          location.reload();
        } else {
          alert('Incorrect password')
        }
      });
  }
  favoris(idProjet: any) {
    const icon = document.querySelector('.favoris') as HTMLElement;
    if (icon) {
      if (this.isFavorit == false)
      {
        this.http.put("http://localhost:3500/Etudiant/Favoris/" + this.homeServices.getTokenEtudiant()._id, { idProjet }).subscribe((resultData: any) => {
          if (resultData)
          {
            this.isFavorit = resultData.isFavorite;
            icon.style.color = 'red';
            Swal.fire({
              icon: 'success',
              title: 'Le projet a bien été ajouté au favoris',
              showConfirmButton: false,
              timer: 1500
            })
          }});
      }
      else
      {
        this.http.put("http://localhost:3500/Etudiant/FavorisNote/" + this.homeServices.getTokenEtudiant()._id, { idProjet }).subscribe((resultData: any) => {
          if (resultData)
          {
            this.isFavorit = resultData.isFavorite;
            icon.style.color = '#d6d6d6';
            Swal.fire({
              icon: 'success',
              title: 'Le projet n\'est plus en favoris :( ',
              showConfirmButton: false,
              timer: 1500
            })

          }});
      }
    } else {
      console.error("L'icône des favoris est introuvable.");
    }
  }

  checkFavorite() {
    const icon = document.querySelector('.favoris') as HTMLElement;

    this.homeServices.getUser(this.idEtudiant).subscribe((data: any) => {
      this.InfoEtudiant = data;
      this.idProjetFavoris = this.InfoEtudiant?.projetsFavoris?.map((projet: any) => projet._id) || [];
      this.isFavorit = this.idProjetFavoris.includes(this.id);
      if (icon) {
        icon.style.color = this.isFavorit ? 'red' : '#d6d6d6';
      }
    }, error => {
      console.error(error);

    });
  }

  ChangerProgression(event: any, competence: any, idProjet: any) {
    const nouvelleProgression = event.target.value;

    this.http.put("http://localhost:3500/Etudiant/CompetenceUpdate/" + this.homeServices.getTokenEtudiant()._id, {
      idProjet,
      nomCompetence: competence.nom,
      progression: nouvelleProgression
    }).subscribe((resultData: any) => {
      if(resultData)
      {
          console.log('====================================');
          console.log("hello");
          console.log('====================================');
      }
    });
  }

  pause(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async stat() {
    await this.pause(1500); // Délai initial de 2 secondes avant de commencer le compteur

    let number = document.getElementById("number") as HTMLElement;
    let counter = 0;
    let intervalId = setInterval(async () => {
      if (counter <= 100) {
        if (number) {
          number.innerHTML = counter + "%";
          document.documentElement.style.setProperty('--percentage', counter.toString());
        }
        counter += 1;
      } else {
        clearInterval(intervalId);
      }
    }, 30); // Délai entre chaque incrémentation du compteur
  }

}
