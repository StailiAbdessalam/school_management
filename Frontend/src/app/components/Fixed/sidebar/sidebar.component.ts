import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/Article/home.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  bodyData: any = {};
  info: any;
  id: any
  TokenDecode: any;
  decodedToken: any;

  constructor(private homeServices: HomeService, private router: Router) {

    this.homeServices.getProjet().subscribe(data => { this.bodyData = data});

    let tokenAdmin = sessionStorage.getItem('Administrateur');
    let tokenEns = sessionStorage.getItem('Enseignant');
    let tokenEtud = sessionStorage.getItem('Etudiant');

    if(tokenAdmin)
    {
      this.decodedToken = jwt_decode(tokenAdmin);
      this.TokenDecode = this.decodedToken.id
      this.id = this.decodedToken.id._id;

      console.log('====================================');
      console.log(this.TokenDecode);
      console.log('====================================');

    }
    if(tokenEns)
    {
      this.decodedToken = jwt_decode(tokenEns);
      this.TokenDecode = this.decodedToken.id
      this.id = this.decodedToken.id._id;
    }
    if(tokenEtud)
    {
      this.decodedToken = jwt_decode(tokenEtud);
      this.TokenDecode = this.decodedToken.id
      this.id = this.decodedToken.id._id;
    }

  }

  ngOnInit() {
  }
}
