import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/services/Article/home.service';

/** @title Form field appearance variants */
@Component({
  selector: 'app-visualiser',
  templateUrl: './visualiser.component.html',
  styleUrls: ['./visualiser.component.css'],
})
export class VisualiserComponent implements OnInit {


iduser: any;
infouser: any = null;
role: any;
  constructor(private route: ActivatedRoute, private homeServices: HomeService, private http: HttpClient,){}

  ngOnInit(): void {


    this.route.paramMap.subscribe(params => {
      this.iduser = params.get('id');
      this.role = params.get('role');

      if(this.role == "Etudiant")
      {
        this.homeServices.getUser(this.iduser).subscribe((data: any) => {
          this.infouser = data;
        });
      }
      else if (this.role == "Enseignant")
      {
        this.homeServices.getEns(this.iduser).subscribe((data: any) => {
        this.infouser = data;
        });
      }
    });
  }



}
