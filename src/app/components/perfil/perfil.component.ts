import { Component, OnInit } from '@angular/core';
import { UserService } from './../../services/user.service';

import { Person } from './../../models/person/person';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  providers:[UserService]
})
export class PerfilComponent implements OnInit {

  public identiti
  public personInfo:Person

  constructor(private _user:UserService) { }

  ngOnInit() {
    this.identiti = this._user.getIdentiti();
    this._user.getUser(this.identiti.name).subscribe(data=>{
      console.log(data.person);
      this.personInfo = data.person;
      console.log(this.personInfo);
    },error=>{
      console.log(error);
    });
  }

}
