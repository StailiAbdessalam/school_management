import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/Article/home.service';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';
import { TableService } from 'src/app/services/Data tables/table.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


export interface UserData {
  id: string;
  userId: string;
  title: any;
  body: any;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  etudiantSelected: boolean = true;
  enseignantSelected: boolean = false;
  id: any
  TokenDecode: any;
  decodedToken: any;
  bodyData: any = [];
  displayedColumns: string[] = ['Nom', 'Prenom', 'Email', 'Ville', 'Telephone', 'CustomColumn'];
  dataSource!: MatTableDataSource<UserData>;
  posts: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private homeServices: HomeService, private http: HttpClient, private service: TableService) {}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

onButtonClick(row: any) {
  // Logique à exécuter lors du clic sur le bouton
  console.log('Bouton cliqué pour la ligne :', row._id);
}

  ngOnInit() {

    if (this.etudiantSelected) {
this.selectEtudiant()
    }
    else if(this.enseignantSelected){
this.selectEnseignant()
    }

    this.homeServices.getProjet().subscribe(data => { this.bodyData = data});

    let tokenAdmin = sessionStorage.getItem('Administrateur');
    let tokenEns = sessionStorage.getItem('Enseignant');
    let tokenEtud = sessionStorage.getItem('Etudiant');

    if(tokenAdmin)
    {
      this.decodedToken = jwt_decode(tokenAdmin);
      this.TokenDecode = this.decodedToken.id
      this.id = this.decodedToken.id._id;
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

  selectEtudiant() {
    this.etudiantSelected = true;
    this.enseignantSelected = false;
    this.homeServices.getAllEtud().subscribe(data => {
      this.bodyData = data;
      this.dataSource = new MatTableDataSource(this.bodyData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  selectEnseignant() {
    this.etudiantSelected = false;
    this.enseignantSelected = true;
    this.homeServices.getAllEns().subscribe(data => {
      this.bodyData = data;
      this.dataSource = new MatTableDataSource(this.bodyData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
