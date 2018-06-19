import { Injectable } from '@angular/core';
import { Http,Response,Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Roles } from './../models/userlms/roles';
import 'rxjs/add/operator/map' ;
import {AuthHttp, AuthConfig} from 'angular2-jwt';


//permitimos con este decorador inyectar a otras dependencias
@Injectable()
export class UserService{

  public url:string;
  public identiti;
  public token;
  public roles;

  constructor(private _http:Http, private http:HttpClient){
    this.url = environment.url;
  }

  //metodo para aplicar el login al usuario
  singUp(usertologin){
    let json = JSON.stringify(usertologin);
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.post(this.url+'login', json, {headers:headers}).map(res=>res.json());
  }

  /*
  metodo para obtener la informacion del usuario
  */
  getUser(username){
    let headers = new Headers({
      'x-access-token':this.getToken()
    });
    return this._http.get(this.url+'api/v1/user/getdetails?name='+username,{headers:headers}).map(res=>res.json());
  }

  /*
  metodo para traer los datos del usuario logueado
  */
  getIdentiti(){
    let identiti = JSON.parse(localStorage.getItem('identiti'));
    if(identiti != 'undefined'){
      this.identiti = identiti;
    }else{
      this.identiti = null;
    }
    return this.identiti;
  }

  /*
  metodo para poner el token del usuario logueado donde el api lo requiera
  */
  getToken(){
    let token = localStorage.getItem('token');
    if (token != 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;
  }

  /*
  metodo para obtener los roles del usuario logueado
  */
  getRolSup(){
    let roles = JSON.parse(localStorage.getItem('roles'));
    if (roles.isSupervisor != 'undefined'){
      console.log("si hay rol de supervisor");
      this.roles = roles;
    }
    return this.roles;
  }

  /*
  Metodo para obtener los roles del usuario
  */
  getRoles(){
    let isOrg:any=[];
    let headers = new Headers({
      'x-access-token':this.getToken()
    });
    return this._http.get(this.url+'api/v1/user/myroles',{headers:headers}).map(res=>res.json());
  }

  /*
  Metodo para imprimir los errores que se generen en API
  */
  parserErrors(error:string):string{
    if(error.match("Not Found")){
      return "Usuario o contraseña invalido, favor de validar que los datos proporcionados sean las correctos";
    }
    return "Error desconocido";
  }

  /*
  Metodo para validar al usuario que se acaba de registrar
  */
  userConfirm(emailuser:any, tokentemp:any, password:any){
    return this._http.get(this.url+'api/user/confirm?email='+emailuser+'&token='+tokentemp+'&password='+password).map(res=>res.json());;
  }

  /*
  funcion para usar el api de recuperacion de contraseña (envio de email al usuario)
  */
  recoverPassword(email:any){
    return this._http.get(this.url+"api/user/validateemail?email="+email).map(res=>res.json());
  }

  /*
  funcion para el cambio de contraseña
  */
  changePassword(newpassword){
    let params = JSON.stringify(newpassword);
    let headers = new Headers(
      {
        'Content-Type':'application/json',
        'x-access-token':this.token
      }
    );
    return this._http.put(this.url+'api/v1/user/passwordchange',params,{headers:headers}).map(res=>res.json());
  }

  /*
  funcion para la recuperacion de contraseña (cambio de contraseña formulario support);
  */
  recoverPass(passwordrecover){
    let params = JSON.stringify(passwordrecover);
    let headers = new Headers(
      {
        'Content-Type':'application/json',
      }
    );
    return this._http.put(this.url+'api/user/passwordrecovery',params,{headers:headers}).map(res=>res.json());
  }
}
