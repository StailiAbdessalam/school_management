import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/services/Article/home.service';
import * as jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  email: string = "";
  password: string = "";
  Etudiant: boolean | undefined;
  Enseignant: boolean | undefined;
  Administrateur: boolean | undefined;
  Login: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.Login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  switcher() {
    const switchers = Array.from(document.querySelectorAll('.switcher'));
    switchers.forEach((item: any) => {
      item.addEventListener('click', () => {
        switchers.forEach((item: any) => item.parentElement.classList.remove('is-active'));
        item.parentElement.classList.add('is-active');
      });
    });
  }

  login() {
    if (this.Administrateur && this.Login.valid) {
      let bodyData = {
        email: this.Login.get('email')?.value,
        password: this.Login.get('password')?.value
      };
      this.http.post("http://localhost:3500/Administrateur/Login", bodyData, { withCredentials: true }).subscribe((resultData: any) => {
        if (resultData) {
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes bien connecté',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigateByUrl('/home');
            sessionStorage.setItem('Administrateur', resultData.token);
          });
        }
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error.message
        });
      });
    } else if (this.Enseignant && this.Login.valid) {
      let bodyData = {
        email: this.Login.get('email')?.value,
        password: this.Login.get('password')?.value
      };
      this.http.post("http://localhost:3500/Enseignant/Login", bodyData, { withCredentials: true }).subscribe((resultData: any) => {
        if (resultData) {
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes bien connecté',
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            this.router.navigateByUrl('/home');
            sessionStorage.setItem('Enseignant', resultData.token);
          });
        }
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error.message

        });
      });
    } else if (this.Etudiant && this.Login.valid) {
      let bodyData = {
        email: this.Login.get('email')?.value,
        password: this.Login.get('password')?.value
      };
      this.http.post("http://localhost:3500/Etudiant/Login", bodyData, { withCredentials: true }).subscribe((resultData: any) => {
        if (resultData) {
          Swal.fire({
            icon: 'success',
            title: 'Vous êtes bien connecté',
            showConfirmButton: false,
            timer: 1000
          }).then(() => {
            this.router.navigateByUrl('/home');
            sessionStorage.setItem('Etudiant', resultData.token);
          });
        }
      }, (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Votre mot de passe ou adresse email est incorrecte'
        });
      });
    }
  }
}
