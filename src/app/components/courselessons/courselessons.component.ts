import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceisorgService } from './../../services/serviceisorg.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-courselessons',
  templateUrl: './courselessons.component.html',
  providers:[ServiceisorgService, UserService]
})
export class CourselessonsComponent implements OnInit {

  courseid;
  identiti;
  listblock:any []=[];

  constructor(private router:Router, private activatedRoute:ActivatedRoute, private user:UserService, private serviceorg:ServiceisorgService) {
    this.activatedRoute.params.subscribe(params=>{
      this.courseid = params['id'];
    });
  }

  ngOnInit() {
    this.identiti = this.user.getIdentiti();
    this.getListBlock();
  }

  /*
  Meotodo para obtener el listado de los cursos
  */
  public getListBlock(){
    this.serviceorg.getlistBlock(this.courseid).subscribe(data=>{
      console.log(data);
      this.listblock = data.message.blocks;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para mostrar el contenido de la lección que selecciona el autor
  */
  public getBlock(id){
    this.router.navigate(['/courseedit',this.courseid,id]);
  }

  /*
  Metodo para regresar a la vista de cursos al autor
  */
  public returnCourses(){
    this.router.navigate(['/editcourses']);
  }

}
