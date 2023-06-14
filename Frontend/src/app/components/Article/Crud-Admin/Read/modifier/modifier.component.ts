import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/services/Article/home.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modifier',
  templateUrl: './modifier.component.html',
  styleUrls: ['./modifier.component.css']
})
export class ModifierComponent implements OnInit {

  nom: string =""
  prenom: string=""
  email: string ="";
  telephone: number | undefined;
  adresse: string = "";
  ville: string = "";
  dateDeNaissance: string=""

  iduser: any
  role: any
  infouser: any
  UserData: any

  UpdateProfileUser: FormGroup;
  constructor(private route: ActivatedRoute, private homeServices: HomeService, private http: HttpClient, private formBuilder: FormBuilder) {
      this.UpdateProfileUser = this.formBuilder.group({
        nom: [''],
        prenom: [''],
        email: ['', [Validators.email]],
        telephone: [''],
        adresse: [''],
        ville: [''],
        dateDeNaissance: ['']
      });
    }
  ngOnInit(){
      this.route.paramMap.subscribe(params => {
        this.iduser = params.get('id');
        this.role = params.get('role');
        if (this.role == "Enseignant")
          {
            this.homeServices.getEns(this.iduser).subscribe(data => {
              this.UserData = data;
            })
          }else if (this.role == "Etudiant") {
            this.homeServices.getUser(this.iduser).subscribe(data => {
              this.UserData = data;
          })
        }

      })
    }

    UpdateUser() {

      let bodyData = {
        nom: this.UpdateProfileUser.get('nom')?.value,
        prenom: this.UpdateProfileUser.get('prenom')?.value,
        email: this.UpdateProfileUser.get('email')?.value,
        telephone: this.UpdateProfileUser.get('telephone')?.value,
        adresse: this.UpdateProfileUser.get('adresse')?.value,
        ville: this.UpdateProfileUser.get('ville')?.value,
        dateDeNaissance: this.UpdateProfileUser.get('dateDeNaissance')?.value
      };

      if (this.role == "Etudiant" && this.UpdateProfileUser.valid) {

        this.http.put("http://localhost:3500/Administrateur/UpdateEtudiant/" + this.iduser, bodyData).subscribe(
          (resultData: any) => {
            if (resultData) {
              Swal.fire({
                icon: 'success',
                title: 'Les informations ont bien été mises à jour. Actualisez la page.',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                location.reload();
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
      } else if (this.role == "Enseignant" && this.UpdateProfileUser.valid) {
        this.http.put("http://localhost:3500/Administrateur/UpdateEnseignant/" + this.iduser, bodyData).subscribe(
          (resultData: any) => {
            if (resultData) {
              Swal.fire({
                icon: 'success',
                title: 'Les informations ont bien été mises à jour. Actualisez la page.',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                location.reload();
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
