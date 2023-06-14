import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { HomeService } from 'src/app/services/Article/home.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  UserData: any = [];
  id: any;
  role: any;
  email: string = "";
  adresse: string = "";
  ville: string = "";
  telephone: number | undefined;
  UpdateProfile: FormGroup;

  constructor(
    private homeServices: HomeService,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.UpdateProfile = this.formBuilder.group({
      email: ['', [Validators.email]],
      adresse: [''],
      ville: [''],
      telephone: ['']
    });
  }

  ngOnInit() {
    let tokenAdmin = sessionStorage.getItem('Administrateur');
    let tokenEns = sessionStorage.getItem('Enseignant');
    let tokenEtud = sessionStorage.getItem('Etudiant');

    if (tokenAdmin) {
      const info = this.homeServices.getTokenAdministrateur();
      this.id = info._id;
      this.role = info.role;
      this.homeServices.getAdmin(this.id).subscribe(data => {
        this.UserData = data;
      });
    }
    if (tokenEns) {
      const info = this.homeServices.getTokenEnseignant();
      this.id = info._id;
      this.role = info.role;
      this.homeServices.getEns(this.id).subscribe(data => {
        this.UserData = data;
      });
    }
    if (tokenEtud) {
      const info = this.homeServices.getTokenEtudiant();
      this.id = info._id;
      this.role = info.role;
      this.homeServices.getUser(this.id).subscribe(data => {
        this.UserData = data;
      });
    }
  }

  Update() {
    if (this.UpdateProfile.valid) {
      let bodyData = {
        email: this.UpdateProfile.get('email')?.value,
        adresse: this.UpdateProfile.get('adresse')?.value,
        ville: this.UpdateProfile.get('ville')?.value,
        telephone: this.UpdateProfile.get('telephone')?.value
      };

      let updateUrl = "";

      if (this.role === "Etudiant") {
        updateUrl = "http://localhost:3500/Etudiant/Modifier/" + this.id;
      } else if (this.role === "Enseignant") {
        updateUrl = "http://localhost:3500/Enseignant/Modifier/" + this.id;
      } else if (this.role === "Administrateur") {
        updateUrl = "http://localhost:3500/Administrateur/Modifier/" + this.id;
      }

      this.http.put(updateUrl, bodyData).subscribe(
        (resultData: any) => {
          if (resultData) {
            Swal.fire({
              icon: 'success',
              title: 'Les informations ont bien été modifiées. Veuillez actualiser la page.',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigateByUrl('/Profile');
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

  confirmerModification() {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir modifier vos informations ?',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Update();
      }
    });
  }
}
