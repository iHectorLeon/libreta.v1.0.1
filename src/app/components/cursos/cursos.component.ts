import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InsertUserService } from './../../services/insert_user.service';
import { CourseService } from './../../services/course.service';
import { Areas } from './../../models/temp/areas';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  providers:[ InsertUserService, CourseService ]
})
export class CursosComponent implements OnInit {

  public org:string;
  public query1:any;
  public ar:Areas;

  public typesdata:any[]=[];
  public carrerasList:any[]=[];
  public areadata:any[]=[];
  public cursoslist:any[]=[];
  public keywords:any[]=[];

  constructor(private _user_insert:InsertUserService, private _course:CourseService, private _router:Router) {
    this.org='conalep';
    this.ar = new Areas('');
    this.getAreas();
    this.verGrados();
    this.getCourseList();
    //testconalepemailv1@email.com
  }
  ngOnInit() {
  }
  public getCourseList(){
    this._course.getCoursesOrg().subscribe(data =>{
      this.cursoslist = data.message.courses;
    },error=>{
      console.log(error.message);
    });
  }
  //
  public getAreas(){
    this._user_insert.getAreas(this.org).subscribe(data=>{
      let objr = data.message;
      this.areadata = objr.details;
    },error=>{
      console.log(error);
    });
  }
  //
  public verCarrera(){
    this.query1={
      area:this.ar.area
    };
    this._user_insert.getCarreras(this.org, this.query1).subscribe(data=>{
      let objr = data.message;
      this.carrerasList = objr.results;
      //console.log(this.carrerasList);
    },error=>{
      console.log(error);
    });
  }
  //
  public verGrados(){
    var type = "semester"
    this.query1={
      type:type
    };
    this._user_insert.getTerms(this.org,this.query1).subscribe(data=>{
      let objr = data.message;
      this.typesdata = objr.results;
    },error=>{
      console.log(error);
    });
  }

  public verCurso(curso){
    this._router.navigate(['/curso',curso]);
  }

  findCourse(wordcode:string){
    if(this.cursoslist.find(id=> id.title == wordcode) ){
      console.log("Coincidencias en la busqueda");
    }else{
      console.log("Sin Coincidencias");
    }

  }
}
