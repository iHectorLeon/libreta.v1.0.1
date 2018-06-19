import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { InsertUserService } from './../../services/insert_user.service';
import { UserService } from './../../services/user.service';

import { Userlms } from './../../models/userlms/userlms';
import { UserTemp } from './../../models/temp/usertemp';
import { States } from './../../models/temp/states';
import { Areas } from './../../models/temp/areas';
import { Person } from './../../models/person/person';
import { Student } from './../../models/student/student';
import { StudentExternal } from './../../models/student/studentExternal';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  providers:[InsertUserService,UserService]
})
export class SigninComponent implements OnInit , DoCheck{

  public userlms:Userlms;
  public usertemp:UserTemp;
  public person:Person;
  public student:Student;
  public studentE:StudentExternal;
  public st:States;
  public ar:Areas;
  public org:string;
  public datosOk:boolean=true;
  public messa_err:string;
  public messa_suc:string;
  public messa_err_per:string;
  public messa_err_org:string;
  public messa_err_std:string;
  public usertype:string;
  public userorig:string;
  public identiti;

  public carrerasList:any[]=[];
  public areadata:any[]=[];
  public typesdata:any[]=[];
  public statesorg:any[];
  public orgUS:any[]=[];
  public query1:any;

  constructor(private _user:UserService, private _user_insert:InsertUserService, private _route:Router) {
    this.org="conalep";
    this.person = new Person('','','','',new Date);
    this.student = new Student('','','');
    this.studentE = new StudentExternal('','','');
    this.usertemp = new UserTemp('','','','');
    this.st = new States('');
    this.ar = new Areas('');
    this.getAreas();
    this.getOrgUnits();
    this.verGrados();
  }

  ngOnInit() {
    //this.identiti = this._user.getIdentiti();
  }

  ngDoCheck() {
    this.usertype;
    this.userorig;
  }
  
  /*
  Funcion para registrar el nuevo usuario
  */
  public onSubmit(){

    this.usertemp.org = "conalep";

    if(this.student.type=="internal"){
      let usert = this.usertemp;
      this.userlms = new Userlms(this.person.email, usert.password, this.person, this.student, usert.org, usert.orgUnit);
    }else{
      let usert = this.usertemp;
      this.studentE.type="external";
      this.userlms = new Userlms(this.person.email, usert.password, this.person, this.studentE, usert.org, usert.orgUnit);
    }

    this._user_insert.registerUser(this.userlms).subscribe(response=>{
      this.messa_suc = "Se ha enviado un correo electronico a la cuenta: "+this.person.email+" para concluir con el proceso de registro"
      this.datosOk = true;
    },error=>{
      var messageerror = JSON.parse(error._body);
      console.log(messageerror);
      this.messa_err = this._user_insert.parserErrors(messageerror.message);
      this.datosOk = false;
    });

  }
  /*
  Metodo para obtener el listado de los estados por parte del conalep
  */
  public getOrgUnits(){
    this.query1={
        type:"state",
        parent:"conalep"
      };
      this._user_insert.getStates(this.org, this.query1).subscribe(data=>{
        let objr = data.message;
        this.statesorg = objr.ous;
      },error=>{
        console.log(error);
      });
  }
  /*
  Funcion para obtener los planteles del estado que seleccion el usuario
  */
  public verPlantel(){
    this.query1={
      type:"campus",
      parent:this._user_insert.parserString(this.st.state)
    };
    this._user_insert.getStates(this.org, this.query1).subscribe(data=>{
      let objr = data.message;
      this.orgUS = objr.ous;
    },error=>{
      console.log(error);
    });
  }
  /*
  Funcion para obtener las areas de educacion de la organizacion
  */
  public getAreas(){
    this._user_insert.getAreas(this.org).subscribe(data=>{
      let objr = data.message;
      this.areadata = objr.details;
    },error=>{
      console.log(error);
    });
  }
  /*
  Funcion para obtener las carreras del area de educacion de la organizacion
  */
  public verCarrera(){
    this.query1={
      area:this.ar.area
    };
    this._user_insert.getCarreras(this.org, this.query1).subscribe(data=>{
      let objr = data.message;
      this.carrerasList = objr.results;
    },error=>{
      console.log(error);
    });
  }
  /*
  Funcion para obtener el listado de semestres
  */
  public verGrados(){
    var type = "semester"
    this.query1={
      type:type
    };
    this._user_insert.getTerms(this.org,this.query1).subscribe(data=>{
      let objr = data.message;
      this.typesdata = objr.results;
    },error=>{
      console.log(error);
    });
  }

  public typeU(){
    this.usertype = this.student.type;
    this.st.state = "";
    this.ar.area  = ""
    this.usertemp.orgUnit = "";
    this.student.term = "";
    this.studentE.external = "";
    this.student.career="";
    this.studentE.origin="";
  }

  public origU(){
    this.userorig = this.studentE.external;
    this.studentE.origin="";
  }

  /*
  validaciones del primer formulario de datos personales
  */
  datosPersonales():string{
    if(this.person.name.length==0  ||
        this.person.fatherName.length==0 ||
        this.person.motherName.length==0 ){
        this.messa_err_per="Los datos marcados con asterisco son obligatorios";
      return "0";
    }else{
      this.messa_err_per="";
      return "1";
    }
  }

  /*
  validaciones del segundo formulario de datos escolares
  */
  public datosOrgs():string{
    if(this.usertype=='internal'){
      if(this.st.state.length===0 || this.st.state === null || this.usertemp.orgUnit.length===0 || this.usertemp.orgUnit === null || this.ar.area.length===0 || this.student.career.length===0 || this.student.term.length===0){
        this.messa_err_org="Selecciona una opcion de cada lista"
        return "1"
      }else{
        this.messa_err_org=""
        return "2"
      }
    }else if(this.usertype=='external'){
      if(this.st.state.length===0 || this.st.state === null || this.usertemp.orgUnit.length===0 || this.usertemp.orgUnit === null || this.studentE.external.length===0){
        this.messa_err_org="Selecciona una opcion de cada lista"
        return "1"
      }else{
        if(this.studentE.external != 'public'){
          this.messa_err_org=""
          return "2"
        }else if(this.studentE.external === 'public' && this.studentE.origin.length===0){
          this.messa_err_org="Selecciona una institucion"
          return "1"
        }else if(this.studentE.external === 'public' && this.studentE.origin.length != 0){
          this.messa_err_org=""
          return "2"
        }
      }

    }else{
      this.messa_err_org="Selecciona una opcion de cada lista"
      return "1"
    }
  }

  public datosStudent():string{
    if(this.ar.area.length===0 || this.student.career.length===0 || this.student.term.length===0){
      this.messa_err_std="Selecciona una opcion de cada lista"
      return"2"
    }else{
      this.messa_err_std=""
      return "3"
    }
  }

}
