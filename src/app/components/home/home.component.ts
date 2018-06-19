import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';


import { UserService } from './../../services/user.service';
import { CourseService } from './../../services/course.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers:[UserService,CourseService]
})
export class HomeComponent implements OnInit {

  public token;
  public identiti;
  public loading:boolean = false;
  public cursos:any[]=[];
  /*
  Constructor de la clase
  */
  constructor(private _course:CourseService, private _user:UserService, private _router:Router, private Meta:Meta) {
    this.Meta.addTag({name:'description', content:'Supérate Mexico es una iniciativa de capacitación en línea que te ayuda en tu desarrollo profesional, adquiriendo nuevas competencias y dándole valor a tus conocimientos'});
  }

  ngOnInit() {
    this.identiti = this._user.getIdentiti();
    this.token = this._user.getToken();
    if(this.token){
      this._router.navigate(['/listcourses']);
    }else{
      this._router.navigate(['/home']);
    }
    this.getCourseList();
  }

  public getCourseList(){
    this.loading = true;
    this._course.getCoursesOrg().subscribe(data =>{
      this.cursos = data.message.courses;
      this.loading = false;
    },error=>{
      console.log(error.message);
    });
  }

  public verCurso(curso){
    this._router.navigate(['/curso',curso]);
  }
}
