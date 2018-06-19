import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { GLOBAL } from './global';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map' ;

@Injectable()
export class ServiceisorgService {

  public url:string;
  public identiti;
  public token;

  /*
  constructor de la clase
  */
  constructor(public _http:Http, public _user:UserService) {
    this.url = environment.url;
    this.token = this._user.getToken();
  }

  /*
  Metodo para obtener los datos de los usuario que obtuvieron su constancia
  */
  public getUserConst(groupid){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/user/tookcert?groupid='+groupid,{headers:headers}).map(res=>res.json());
  }

  /*
  Metodo para obtener las calificaciones por ou
  */
  getGradesbyou(){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/rostersummary',{headers:headers}).map(res=>res.json());
  }

  /*
  Metodo para obtener la actividad de usuarios por grupo
  */
  getGradesforgroup(idgroup:any){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/gradesbygroup?groupid='+idgroup,{headers:headers}).map(res=>res.json());
  }
  /*
  Metodo para los alumnos inactivos
  */
  getUserInactives(){
    let header = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/userswoactivity',{headers:header}).map(res=>res.json());
  }
  /*
  Metodo para los reportes estadisticos
  */
  public getCharts(){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/percentil',{headers:headers}).map(res=>res.json());
  }

  /*
  reseteo de contraseña por usuario isOrg
  */
  public resetpassisorg(emailuser:string){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/orgadm/user/passwordreset?username='+emailuser,{headers:headers}).map(res=>res.json());
  }

  /*
  agregar una nueva seccion a un curso
  */
  public setSection(coursecode){
    let params = JSON.stringify(coursecode);
    let headers = new Headers({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    console.log(params);
    return this._http.put(this.url +'api/v1/author/course/newsection' ,params ,{headers:headers}).map(res=>res.json());
  }

  /*
  Metodo para agregar el bloque a un curso
  */
  public setNewBlock(block){
    let params = JSON.stringify(block);
    console.log(params);

    let headers = new Headers({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.post(this.url +'api/v1/author/course/createblock' ,params ,{headers:headers}).map(res=>res.json());

  }
  /*
  Metodo para agregar un nuevo curso
  */
  public setNewCourse(course){
    let params = JSON.stringify(course);
    let headers = new Headers({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.post(this.url +'api/v1/author/course/create' ,params ,{headers:headers}).map(res=>res.json());
  }

  /*
  Metodo para calificar las tareas desde la vista del tutor
  */
  public setgradeTask(gradetask){
    let params = JSON.stringify(gradetask);
    let headers = new Headers({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.put(this.url +'api/v1/instructor/group/gradetask' ,params ,{headers:headers}).map(res=>res.json());
  }

  /*
  Metodo para modificar el contenido del curso
  */
  public updateContent(block:any){
    let params = JSON.stringify(block);
    console.log(params);
    let headers = new Headers({
      'Content-Type':'application/json',
      'x-access-token':this.token
    });
    return this._http.put(this.url +'api/v1/author/course/modifyblock' ,params ,{headers:headers}).map(res=>res.json());
  }
  /*
  Metodo para traer el contenido del curso que editara el autor
  */
  public getContent(id){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/author/course/getblock?id='+id,{headers:headers}).map(res=>res.json());
  }

  /*
  metodo para obtener el temario por cada curso y mostrarlo al autor
  */
  public getlistBlock(courseid){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/author/course/getblocklist?id='+courseid+'&section1=0&section2=500',{headers:headers}).map(res=>res.json());
  }

  /*
  metodo para obtener el listado de cursos y mostrarlos al autor
  */
  public getCoursesAuth(){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/course/listcourses',{headers:headers}).map(res=>res.json());
  }

  /*
  obtener la tarea por alumno
  */
  public getTask(groupid, studentid, blockid){
    let headers = new Headers({
      'x-access-token':this.token
    });
    //api/v1/instructor/group/studenttask?groupid='+groupid+'&studentid='+studentid+'&blockid='+blockid
    return this._http.get(this.url+'api/v1/instructor/group/studenttask?groupid='+groupid+'&studentid='+studentid+'&blockid='+blockid,{headers:headers}).map(res=>res.json());
  }
  /*
  Obtener el listado de los alumnos con el detalle de cada uno
  */
  public getlistroster(groupcode){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/listroster?code='+groupcode,{headers:headers}).map(res=>res.json());
  }

  /*
  Obtener el listado de los grupos asignados por tutor
  */
  public mylistgroup(){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/instructor/group/mylist',{headers:headers}).map(res=>res.json());
  }

  /*
  Reportes por campo
  */
  public getReportsOrg(){
    let headers = new Headers({
      'x-access-token':this.token
    });
    return this._http.get(this.url+'api/v1/supervisor/report/gradesbycampus',{headers:headers}).map(res=>res.json());
  }
}
