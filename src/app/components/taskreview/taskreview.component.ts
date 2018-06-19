import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from './../../services/user.service';
import { ServiceisorgService } from './../../services/serviceisorg.service';

@Component({
  selector: 'app-taskreview',
  templateUrl: './taskreview.component.html',
  providers:[UserService,ServiceisorgService]
})
export class TaskreviewComponent implements OnInit {
  public token;
  public idrooster:any;
  public curso:string;
  public grupo:string;
  public beginDate:Date;
  public endDate:Date;
  public totalStudents:number;
  public students:any[]=[];
  groupCode:string;

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService, private serviceisorg:ServiceisorgService) {
    this.token = this._user.getToken();
    this._activeRouter.params.subscribe(params=>{
      this.groupCode = params['groupCode'];
    });
  }
  ngOnInit() {
    this.getTasks();
  }

  /*
  Metodo para obtener el listado de los alumnos por grupo con sus respectivas tareas
  */
  public getTasks(){
    this.serviceisorg.getlistroster(this.groupCode).subscribe(data=>{
      console.log(data.message);
      let content = data.message;
      this.idrooster = content.id;
      this.curso = content.name;
      this.grupo = content.code;
      this.totalStudents = content.numStudents;
      this.beginDate = content.beginDate;
      this.endDate = content.endDate;
      this.students =content.students;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para enviar a la vista de tareas
  */
  setTaskReview(studentid:any,grades:any){
    let blockid:any;
    for(let id of grades){
      blockid = id.blockid;
    }
    this._router.navigate(['/tasksview',this.grupo, this.idrooster, studentid, blockid]);
  }
}
