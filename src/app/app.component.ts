import { Component, OnInit, DoCheck } from '@angular/core';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';

//Servicios
import { UserService } from './services/user.service';
import { CourseService } from './services/course.service';

//Modelos
import { Login } from './models/login/login';
import { PassChange } from './models/temp/passChange';
import { NewPassword } from './models/temp/newpassword';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {

  color = '#00f';
  public loading:boolean = false;
  public login     : Login;
  public passtemp  : PassChange;
  public newpassword : NewPassword;
  public datosOk   : boolean = true;
  public datosOkR  : boolean = false;
  public rolOrg    : boolean =  false;
  public rolSup    : boolean =  false;
  public rolUser  : boolean = false;
  public rolAdmin : boolean = false;
  public rolAutho : boolean = false;
  public rolInstructor : boolean = false;
  public message_re : string;
  public message_er : string;
  public closemodal : NgbModalRef;
  public identiti;
  public token;
  public roles;
  /*
  Constructor de la clase
  */
  constructor(private _user:UserService, private _router:Router, private modalService:NgbModal, private Meta:Meta, private _course:CourseService){
    this.login = new Login('','');
    this.passtemp = new PassChange('','');
    this.Meta.addTag({name:'description', content:'Supérate Mexico es una iniciativa de capacitación en línea que te ayuda en tu desarrollo profesional, adquiriendo nuevas competencias y dándole valor a tus conocimientos'});
  }

  /*
  función de arranque del componente
  */
  ngOnInit(){
    this.loading = true;
    this.identiti = this._user.getIdentiti();
    this.token = this._user.getToken();
    this._user.getRoles().subscribe(data=>{
      this.rolUser = data.message.isUser;
      this.rolSup = data.message.isSupervisor;
      this.rolAdmin = data.message.isAdmin;
      this.rolAutho = data.message.isAuthor;
      this.rolInstructor = data.message.isInstructor;
      this.rolOrg = data.message.isOrg;
    },error=>{
      console.log(error);
    });
    this.loading = false;
  }

  /*
  función de cambios en el componente
  */
  ngDoCheck(){
    this.identiti = this._user.getIdentiti();
    this.token = this._user.getToken();
  }

  /*
  funcion para abrir el elemento modal del login del usuario
  */
  openDialog(content){
    this.closemodal = this.modalService.open(content);
  }

  /*
  funcion para cerrar el elemento modal del login del usuario
  */
  closeDialog(){
    this.closemodal.dismiss();
    this.passtemp = new PassChange('','');
    this.datosOkR = false;
  }

  /*
  funcion para usar el api de login
  */
  onSubmit(){
    if(this.login.username.length===0 || this.login.password.length===0){
      this.datosOk = false;
      this.message_er="Los campos de usuario y contraseña son obligatorios"
    }else{
      //api login del usuario
      this._user.singUp(this.login).subscribe(data=>{
        this.token = data.token;
        localStorage.setItem('token',this.token);
        //Metodo para traer la informacion del usuario y guardarla en el localStorage
        this._user.getUser(this.login.username).subscribe(data=>{
          let identiti = data;
          localStorage.setItem("identiti",JSON.stringify(identiti));
          this.closeDialog();
          this._router.navigate(['/listcourses']);
        },error=>{
          this.message_er = "Usuario o contraseña invalidos, favor de validar que los datos proporcionados sean los correctos"
          this.datosOk = false;
        });
        //Metodo para consultar los roles del usuario
        this._user.getRoles().subscribe(data=>{
          this.rolUser = data.message.isUser;
          this.rolSup = data.message.isSupervisor;
          this.rolAdmin = data.message.isAdmin;
          this.rolAutho = data.message.isAuthor;
          this.rolInstructor = data.message.isInstructor;
          this.rolOrg = data.message.isOrg;
        },error=>{
          console.log(error);
        });
      },error=>{
        let objr = error.statusText;
        this.message_er = "Usuario o contraseña invalidos, favor de validar que los datos proporcionados sean los correctos"
        this.datosOk = false;
      });
    }
  }

  /*
  funcion para el cierre de sesion del usuario
  */
  logout(){
    localStorage.removeItem('identiti');
    localStorage.removeItem('token');
    localStorage.clear();
    this._router.navigate(['/home']);
  }

  /*
  funcio de envio de correo para la recuperacion de contraseña
  */
  recoverPassword(){
    this._user.recoverPassword(this.login.username).subscribe(data=>{
      this.datosOkR = true;
      this.message_re = "Se enviò un mensaje a tu correo electrónico con instrucciones para recuperar tu contraseña."
    },error=>{
      console.log(error);
      this.datosOk = false;
      this.message_er = "Ocurrió un error iterno de la plataforma, favor de reportarlo con el administrador desde nuestra mesa de ayuda";
    });
  }

  /*
  funcion de cambio de contraseña
  */
  changePassword(){
    if(this.passtemp.passwordTemp == this.passtemp.passwordRTemp){
      this.newpassword = new NewPassword(this.identiti.name, this.passtemp.passwordTemp);
      this._user.changePassword(this.newpassword).subscribe(data=>{
        this.datosOkR = true;
        this.message_re="Se actualizo la contraseña correctamente";
      },error=>{
        this.datosOk = false
        this.message_er="No se actualizo la contraseña correctamente";
        console.log(error);
      });
    }else{
      this.datosOk = false;
      this.message_er = "Las contraseñas no coinciden";
    }

  }

  /*
  función para enviar al usuario a su detalle de perfil
  */
  public getProfile(){
    this._router.navigate(['/perfil']);
  }
}
