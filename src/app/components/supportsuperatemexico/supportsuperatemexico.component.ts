import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//Servicios
import { UserService } from '../../services/user.service';

//Modelos de datos
import { Login } from '../../models/login/login';
import { PassChange } from '../../models/temp/passChange';
import { RecoverPass } from '../../models/temp/recoverpass'

@Component({
  selector: 'app-supportsuperatemexico',
  templateUrl: './supportsuperatemexico.component.html',
})
export class SupportsuperatemexicoComponent implements OnInit, DoCheck {

  public loading:boolean = false;
  public login:Login;
  public passtemp:PassChange;
  public passwordrecover:RecoverPass;

  public support:boolean = false;
  public operacion:string;
  public idtemp:any;
  public emailuser:any;
  public password:string;

  public datosOkInfo : boolean =false;
  public message_inf : string;
  public datosOk   : boolean = true;
  public message_er : string;

  public token;

  /*
  constructor de la clase
  */
  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _user:UserService) {

    this.login = new Login('','');
    this.passtemp = new PassChange('','');
    this.loading = true;
    this._activeRouter.params.subscribe( params =>{
      if(params['operacion']!=null){
        this.operacion=params['operacion'];
      }
      if(params['idtemporal']!=null){
        this.idtemp=params['idtemporal'];
      }
      if(params['emailuser']!=null){
        this.emailuser=params['emailuser'];
      }
    });

  }

  /*
  metodo init de Angular
  */
  ngOnInit() {
    this.support = true;
    this.token = this._user.getToken();
    this.loading = false;
  }

  /*
  metodo DoCheck
  */
  ngDoCheck(){
    this.token = this._user.getToken();
  }

  /*
  funcion para validar a un usuario nuevo
  */
  public signin(){
    this.login.username = this.emailuser;
    if(this.login.username.length===0 || this.login.password.length===0){
      this.datosOk = false;
      this.message_er="El campo de contraseña es obligatorio"
    }else{
      this._user.userConfirm(this.emailuser,this.idtemp,this.login.password).subscribe(succes=>{
        this._user.singUp(this.login).subscribe(data=>{
          this.token = data.token;
          localStorage.setItem('token',this.token);
          //Metodo para traer la informacion del usuario y guardarla en el localStorage
          this._user.getUser(this.login.username).subscribe(data=>{
            let identiti = data;
            localStorage.setItem("identiti",JSON.stringify(identiti));
            this._router.navigate(['/listcourses']);
          },error=>{
            this.message_er = "Usuario o contraseña invalidos, favor de validar que los datos proporcionados sean los correctos"
            this.datosOk = false;
          });
          //Metodo para consultar los roles del usuario
          this._user.getRoles().subscribe(data=>{
            let roles = data.message;
            localStorage.setItem("roles",JSON.stringify(roles));
          },error=>{
            console.log(error);
          });
        },error=>{
          let objr = error.statusText;
          this.message_er = "Usuario o contraseña invalidos, favor de validar que los datos proporcionados sean los correctos"
          this.datosOk = false;
        });
      },error=>{
        console.log(error);
      });
    }
  }

  /*
  funcion para reseteo de contraseña
  */
  public recoverPass(){
    if(this.passtemp.passwordTemp == this.passtemp.passwordRTemp){

      this.passwordrecover = new RecoverPass(this.emailuser,this.idtemp,this.passtemp.passwordTemp);

      this._user.recoverPass(this.passwordrecover).subscribe(data=>{
        this.datosOkInfo = true;
        this.message_inf = "Se actualizó la contraseña correctamente."

        this.login = new Login(this.emailuser, this.passtemp.passwordTemp);

        this._user.singUp(this.login).subscribe(data=>{
          this.token = data.token;
          localStorage.setItem('token',this.token);

          //Metodo para traer la informacion del usuario y guardarla en el localStorage
          this._user.getUser(this.login.username).subscribe(data=>{
            let identiti = data;
            localStorage.setItem("identiti",JSON.stringify(identiti));
            this._router.navigate(['/listcourses']);
          },error=>{
            console.log(error);
          });

          //Metodo para consultar los roles del usuario
          this._user.getRoles().subscribe(data=>{
            let roles = data.message;
            localStorage.setItem("roles",JSON.stringify(roles));
          },error=>{
            console.log(error);
          });

        },error=>{
          console.log(error)
        });

      },error=>{
        console.log(error);
      });

    }else{

      this.datosOk = false;
      this.message_er = "Las contraseñas no coinciden"

    }
  }
}
