import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';
import { CourseService } from './../../services/course.service';



@Component({
  selector: 'app-mygroups',
  templateUrl: './mygroups.component.html',
  providers:[UserService,CourseService]
})
export class MygroupsComponent implements OnInit {

  public identiti;
  public token;

  public cursoslist:any[];
  public messageNewUser : boolean = false;

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService, private _course:CourseService) {
    this.identiti = this._user.getIdentiti();
    this.token = this._user.getToken();
  }

  ngOnInit() {
    this.identiti = this._user.getIdentiti();
    this._course.getCourses(this.token).subscribe(data =>{
      let objr = data.message.groups;
      this.cursoslist = objr;
      this.messageNewUser = false;
    },error=>{
      this.messageNewUser = error._body.includes('"message":"No groups found"');
    });
  }

  /*
  Metodo para redireccionar al usuario al curso que selecciono
  */
  public getMycourse(course:string, groupid:string, courseid:string, lastSeenBlock:string, firstBlock:string){
    if(!lastSeenBlock){
      this._router.navigate(['/mycourses',course,groupid,courseid,firstBlock]);
    }else{
      this._router.navigate(['/mycourses',course,groupid,courseid,lastSeenBlock]);
    }
  }

}
