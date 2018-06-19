import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from './../../services/user.service';
import { ServiceisorgService } from './../../services/serviceisorg.service';

import { TaskGrade } from './../../models/course/taskgrade';

@Component({
  selector: 'app-tasksview',
  templateUrl: './tasksview.component.html',
  providers:[UserService,ServiceisorgService]
})
export class TasksviewComponent implements OnInit {

  rosterid:any;
  groupCode:any;
  groupid:string;
  studentid:string;
  blockid:any;
  grade:number;
  messageSuccess:any;
  taskGrade:TaskGrade;

  tabs:any[]=[];

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService, private serviceisorg:ServiceisorgService) {
    this._activeRouter.params.subscribe(params=>{
      if(params['groupCode']!=null){
        this.groupCode = params['groupCode'];
      }
      if(params['groupid']!=null){
        this.groupid = params['groupid'];
      }
      if(params['studentid']!=null){
        this.studentid = params['studentid'];
      }
      if(params['blockid']!=null){
        this.blockid = params['blockid'];
      }
    });
  }

  ngOnInit() {
    this.getTask(this.groupid, this.studentid, this.blockid);
  }

  /*
  Metodo para guardar la calificacion de la tarea
  */
  saveGradetask(taskid, grade, label){
    this.taskGrade = new TaskGrade(this.rosterid,this.blockid,taskid,grade);
    this.serviceisorg.setgradeTask(this.taskGrade).subscribe(data=>{
      this.messageSuccess="Se guardo la calificación para la tarea "+label
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para obtener las tareas
  */
  public getTask(groupid, studentid, blockid){
    this.serviceisorg.getTask(groupid, studentid, blockid).subscribe(data=>{
      let result = data.message;
      this.tabs = result.tasks;
      this.rosterid = result.rosterid
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para regresar a la vista de tareas del tutor
  */
  returnTaskReview(){
    this._router.navigate(['/taskreview', this.groupCode]);
  }
}
