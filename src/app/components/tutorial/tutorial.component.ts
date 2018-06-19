import { Component, OnInit } from '@angular/core';
import { ServiceisorgService } from './../../services/serviceisorg.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  providers:[ServiceisorgService]
})
export class TutorialComponent implements OnInit {

  public mygrouplist:any[]=[];

  constructor(public serviceorg:ServiceisorgService, private router:Router) { }

  ngOnInit() {
    this.getList();
  }

  /*
  Metodo para obtener la lista de los grupos asignados
  */
  public getList(){
    this.serviceorg.mylistgroup().subscribe(data=>{
      this.mygrouplist = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para ir al listado de alumnos del grupo
  */
  public getTasksReview(groupCode){
    this.router.navigate(['/taskreview',groupCode]);
  }
}
