import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { ServiceisorgService } from './../../services/serviceisorg.service';


@Component({
  selector: 'app-editcourses',
  templateUrl: './editcourses.component.html',
  providers:[UserService, ServiceisorgService]
})
export class EditcoursesComponent implements OnInit {
  identiti;
  public cursoslist:any[]=[];

  constructor(public serviceorg:ServiceisorgService, private _router:Router, private _activeRouter:ActivatedRoute, private user:UserService) {
    this.identiti = this.user.getIdentiti();
  }

  ngOnInit() {
    this.getCourses();
  }

  /*
  funcion para obtener los cursos y los vea el autor
  */
  public getCourses(){
    this.serviceorg.getCoursesAuth().subscribe(data=>{
      console.log(data);
      this.cursoslist = data.message.courses;
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para mostrar el temario del curso que seleccione el autor
  */
  public getCourse(courseid){
    this._router.navigate(['/courselessons',courseid]);
  }

  /*
  Metodo para regresar al administrador de edicion de cursos
  */
  public getEditManager(){
    this._router.navigate(['/editmanager']);
  }

}
