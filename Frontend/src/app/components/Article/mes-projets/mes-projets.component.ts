import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { HomeService } from 'src/app/services/Article/home.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mes-projets',
  templateUrl: './mes-projets.component.html',
  styleUrls: ['./mes-projets.component.css']
})
export class MesProjetsComponent implements OnInit {

  etudiantSelected: boolean = true;
  enseignantSelected: boolean = false;
  UserData: any = [];
  UserPro: any
  id: any
  TokenDecode: any;
  decodedToken: any;

  CreerProfile: FormGroup;
  constructor(private homeServices: HomeService, private formBuilder: FormBuilder, private http: HttpClient,  private router: Router) {

      this.CreerProfile = this.formBuilder.group({
        nom: ['', [Validators.required]],
        prenom: ['', [Validators.required]],
        adresse: ['', [Validators.required]],
        email: ['', [Validators.email,Validators.required]],
        dateDeNaissance: ['', [Validators.required]],
        ville: ['', [Validators.required]],
        telephone: ['', [Validators.required]],
        sexe: ['', [Validators.required]]
      });
    }

  ngOnInit() {
    let tokenAdmin = sessionStorage.getItem('Administrateur');
    let tokenEns = sessionStorage.getItem('Enseignant');
    let tokenEtud = sessionStorage.getItem('Etudiant');

    if(tokenAdmin)
    {
      this.decodedToken = jwt_decode(tokenAdmin);
      this.TokenDecode = this.decodedToken.id
    }
    if(tokenEns)
    {
      this.decodedToken = jwt_decode(tokenEns);
      this.TokenDecode = this.decodedToken.id
      this.id = this.decodedToken.id._id;

      this.homeServices.getEns(this.id).subscribe(data => {
        this.UserData = data
        this.UserPro = this.UserData.projetsCreer
      })
    }
    if(tokenEtud)
    {
      this.decodedToken = jwt_decode(tokenEtud);
      this.TokenDecode = this.decodedToken.id
      this.id = this.decodedToken.id._id;

      this.homeServices.getUser(this.id).subscribe(data => {
        this.UserData = data
        this.UserPro = this.UserData
      });
    }
  }


  selectEtudiant() {
    this.etudiantSelected = true;
    this.enseignantSelected = false;

    // la post étudiant
  }

  selectEnseignant() {
    this.etudiantSelected = false;
    this.enseignantSelected = true;

    // la post e,seig,ayt
  }

  Creation() {
    if (this.CreerProfile.valid) {
      let bodyData = {
        nom: this.CreerProfile.get('nom')?.value,
        prenom: this.CreerProfile.get('prenom')?.value,
        adresse: this.CreerProfile.get('adresse')?.value,
        email: this.CreerProfile.get('email')?.value,
        password: "abdel",
        dateDeNaissance: this.CreerProfile.get('dateDeNaissance')?.value,
        ville: this.CreerProfile.get('ville')?.value,
        telephone: this.CreerProfile.get('telephone')?.value,
        sexe: this.CreerProfile.get('sexe')?.value,
      };

      if (this.etudiantSelected) {
        this.http.post("http://localhost:3500/Etudiant/ajouter", bodyData).subscribe(
          (resultData: any) => {
            if (resultData) {
              Swal.fire({
                icon: 'success',
                title: 'Le compte a bien été créé',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.router.navigateByUrl('/home');
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
      } else if (this.enseignantSelected) {
        this.http.post("http://localhost:3500/Enseignant/ajouter", bodyData).subscribe(
          (resultData: any) => {
            if (resultData) {
              Swal.fire({
                icon: 'success',
                title: 'Le compte a bien été créé',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.router.navigateByUrl('/home');
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
  }
}
