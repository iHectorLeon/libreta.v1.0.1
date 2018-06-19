import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import { CourseService } from './../../services/course.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  providers:[CourseService,UserService]
})
export class ModulesComponent implements OnInit {

  public identiti;
  public token;

  public block:any = [];

  public groupid:string;
  public courseid:string;
  public titleCourse:string;

  constructor( private _router:Router, private _activeRouter:ActivatedRoute, private _cursosService:CourseService, private _userService:UserService) {

    this.identiti = this._userService.getIdentiti();
    this.token = this._userService.getToken();

    this._activeRouter.params.subscribe(params =>{
      if(params['curso']!=null){
        this.titleCourse=params['curso'];
      }
      if(params['groupid']!=null){
        this.groupid=params['groupid'];
      }
      if(params['courseid']!=null){
        this.courseid=params['courseid'];
      }
    });
    this._cursosService.showBlocksTrack(this.groupid, this.token).subscribe(data=>{
        let objr = data.message.blocks;
        this.block = objr;
    },error=>{
      console.log(error)
    });
  }

  ngOnInit() {
  }

  getBlock(id:string){
    this._router.navigate(['/block',this.titleCourse,this.groupid,this.courseid,id]);
  }

}
