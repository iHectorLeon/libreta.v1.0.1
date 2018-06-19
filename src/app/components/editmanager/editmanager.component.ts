import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-editmanager',
  templateUrl: './editmanager.component.html',
  providers:[UserService]
})
export class EditmanagerComponent implements OnInit {
  identiti;
  constructor(private user:UserService, private _router:Router) {
    this.identiti = this.user.getIdentiti();
  }

  ngOnInit() {
  }

  /*
  metodo para redireccionar a la vista de edicion de cursos
  */
  getEditCourses(){
    this._router.navigate(['/editcourses']);
  }

  /*
  metodo para redireccionar a la vista de edicion de cursos
  */
  getnewCourses(){
    this._router.navigate(['/newcourse']);
  }

  /*
  metodo para redireccionar a la vista de edicion de cursos
  */
  getnewBlocks(){
    this._router.navigate(['/newblock']);
  }

}
