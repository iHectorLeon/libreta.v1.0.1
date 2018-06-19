import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CourseService } from './../../services/course.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  providers:[CourseService,UserService]
})
export class CursoComponent implements OnInit {

  public identiti;
  public token;
  public curso:any = [];
  public block:any = [];
  public sections:any [] = [];
  public contents:any [] = [];
  public idc:string;

  constructor(private _activeRouter:ActivatedRoute, private _cursosService:CourseService, private _userService:UserService) {
    this.identiti = this._userService.getIdentiti();
    this.token = this._userService.getToken();
    this._activeRouter.params.subscribe( params =>{
      this.curso = this._cursosService.showCourses(params['id']);
      this._cursosService.showBlocks(params['id']).subscribe(data=>{
        console.log(data);
          let objr = data.message.blocks;
          this.block = objr;
      },error=>{
        console.log(error)
      });
    });
  }
  ngOnInit() {
  }
}
