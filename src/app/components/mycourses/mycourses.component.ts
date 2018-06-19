import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DatePipe, DecimalPipe, } from '@angular/common';

import { CourseService } from './../../services/course.service';
import { UserService } from './../../services/user.service';
import { ServiceisorgService } from './../../services/serviceisorg.service';

import { Doubt } from './../../models/temp/doubt';
import { Comment } from './../../models/course/comment';
import { Discussion } from './../../models/course/discussion';
import { Reply } from './../../models/course/reply';

import * as jsPDF from 'jspdf';
import { IMGCONSTCONA } from './../../models/temp/imgconstancias';

@Component({
  selector: 'app-mycourses',
  templateUrl: './mycourses.component.html',
  providers: [CourseService, UserService, ServiceisorgService, DatePipe, DecimalPipe]
})
export class MycoursesComponent implements OnInit, DoCheck {

  public identiti;
  public token;

  public doubt:Doubt;
  public comment:Comment;
  public reply:Reply;

  public titleDoubt:string;
  public descDoubt:string;

  public rootcomment:any;
  public replytocomment:any;
  public blockcomment:any;

  public rootreply:any;
  public commentidreply:any;
  public replytoreply:any;
  public blockreply:any;

  public descComment:string;

  public discussion:Discussion;
  public replyEnt:Reply;
  public discussions:any[]=[];
  public comments:any[]=[];
  public replys:any[]=[];
  public grades:number[]=[];

  public imgconalogo:any;
  public groupid:string;
  public courseid:string;
  public blockid:string;
  public curso:string;
  public minGrade:any;
  public minTrack:any;
  public finalGrade:any;
  public pass:boolean = false;
  public certificateActive:boolean=false;
  public rolUser:boolean;

  public nameStudent:string;
  public date:any;
  public duration:any;
  public durationUnit:any;
  public course:string;

  public block:any = [];
  public blockgrades:any[];
  public sections:any [] = [];
  public contcourse:any [];
  public idc:string;
  public totalgrades:number=0;
  public gradefinal:number=0;

  public testn: number;
  public trackPercent:number;
  public trackblock:any;
  public urlResource:string;
  public arrayblocks:any[];
  public contentblock:any;
  public resources:any[];
  public endDate:Date;
  public beginDate:Date;
  public endCourse:boolean;
  public endDateSpa:any;
  public beginDateSpa:any;

  public closemodal:NgbModalRef;

  /*
  constructor de la clase
  */
  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _cursosService:CourseService, private _userService:UserService, private modalService:NgbModal, private domnsanitizer:DomSanitizer, public datePipe:DatePipe, public decimal:DecimalPipe, public serviceorg:ServiceisorgService) {

    this.imgconalogo = IMGCONSTCONA.imgconstancias2;
    this.rolUser = true;
    this._activeRouter.params.subscribe( params =>{
      if(params['curso']!=null){
        this.curso = params['curso'];
      }
      if(params['groupid']!=null){
        this.groupid = params['groupid'];
      }
      if(params['courseid']!=null){
        this.courseid=params['courseid'];
      }
      if(params['blockid']!=null){
        this.blockid=params['blockid'];
      }
    });
  }
  //password

  /*
  Metodo init de la clase
  */
  ngOnInit() {
    this.identiti = this._userService.getIdentiti();
    this.token = this._userService.getToken();
    this.contcourse = this._cursosService.showCourses(this.courseid);
    this.getMyGrades();
    this.getDiscussionCourse();
    this.getCommentsCourses();
    this.getReplysCourses();

    this._cursosService.showBlocksTrack(this.groupid, this.token).subscribe(data=>{
      let objr = data.message.blocks;
      this.block = objr;
    },error=>{
      console.log(error)
    });

    this._cursosService.getReources(this.groupid, this.token).subscribe(data=>{
      this.resources = data.message;
    },error=>{
      console.log(error);
    });
    this.percentTrack();
  }

  ngDoCheck(){
    this.identiti = this._userService.getIdentiti();
    this.token = this._userService.getToken();
  }

  /*

  */
  public getReplysCourses(){
    this._cursosService.getReplysCourses(this.courseid,this.groupid).subscribe(data=>{
      this.replys = data.message;
    },error=>{
      console.log(error);
    });
  }
  /*

  */
  public getCommentsCourses(){
    this._cursosService.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
      this.comments = data.message;
    },error=>{
      console.log(error);
    });
  }
  /*
  Metodo para los temas del foro de discusion
  */
  public getDiscussionCourse(){
    this._cursosService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
      this.discussions = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para obtener las calificaciones y avance del estudiante
  */
  public getMyGrades(){
    var today = new Date();
    this._cursosService.getMyGrades(this.groupid, this.token).subscribe(data=>{
      console.log(data);
      let res = data.message
      this.finalGrade = res.finalGrade;
      this.minGrade = res.minGrade;
      this.minTrack = res.minTrack;
      this.blockgrades = res.blocks;
      this.certificateActive = res.certificateActive;

      this.nameStudent = res.name;
      this.date = res.passDate;
      this.duration = res.duration;
      this.durationUnit = res.durationUnits;
      this.course = res.course;
      this.endDate = new Date(res.endDate);
      this.beginDate = new Date(res.beginDate);
      this.endDateSpa = res.endDateSpa;
      this.beginDateSpa= res.beginDateSpa;

      if(this.endDate.getTime() < today.getTime()){
        this.endCourse = false;
      }else{
        this.endCourse = true;;
      }

      if(res.pass){
        this.pass = true;
      }else{
        this.pass = false;
      }

      for(let idgrade of this.blockgrades){
        this.totalgrades = this.totalgrades + idgrade.blockW;
        var values = (idgrade.grade*idgrade.blockW)/100;
        this.gradefinal = this.gradefinal+values;
        this.grades.push(values);
      }
    },error=>{
      console.log(error);
    });
  }

  /*
  funcion para agregar una nueva discusion en FAQ
  */
  shownewDoubt(content){
    this.closemodal = this.modalService.open(content);
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showComment(content, id_root, block?){
    this.closemodal = this.modalService.open(content);
    this.rootcomment = id_root;
    this.replytocomment = id_root;
    this.blockcomment = block;
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showReply(content, id, root, block?){
    this.closemodal = this.modalService.open(content);
    this.replytoreply = id;
    this.rootreply = root;
    this.commentidreply = id;
    this.blockreply = block;
  }

  /*
  Metodo para imprimir la constancia del curso
  */
  public getCertificated(){

    this.serviceorg.getUserConst(this.groupid).subscribe(data=>{
      console.log(data);
    },error=>{
      console.log(error);
    });

    let finalgrade = this.decimal.transform(this.finalGrade,'.0-2');

    let dateFormat = this.datePipe.transform(this.date, 'dd/MM/yyyy');
    //let duracion = duration;

    var doc = new jsPDF();
    doc.addImage(this.imgconalogo,'jpg',5,0,200,300);
    // Seccion del nombre del alumno
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(24);
    doc.text(105,155,this.nameStudent,null,null,'center');

    //Seccion del nombre del curso
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(16);
    doc.text(105,181,'"'+this.course+'"',null,null,'center');

    //Seccion de la calificacion final del estudiante
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(11);
    doc.text(111,173,finalgrade,'center');

    //duracion del curso
    doc.setFont("georgia");
    doc.setFontType('regular');
    doc.setFontSize(12);
    doc.text(70,190,''+this.duration+' '+this.durationUnit);

    //fecha de termino del curso por parte del alumno
    /*
    doc.setFont("georgia");
    doc.setFontType('regular');
    doc.setFontSize(12);
    doc.text(114,190,dateFormat,null,null,'center');
    */
    doc.save(this.nameStudent+"_"+this.course);
  }

  /*
  Metodo para ir al curso desde la pestaña de mi progreso actual
  */
  getLesson(){
    this._router.navigate(['/block',this.curso,this.groupid,this.courseid,this.blockid]);
  }

  /*
  Metodo para ir a la leccion desde el temario
  */
  getBlock(id:string){
    this._router.navigate(['/block',this.curso,this.groupid,this.courseid,id]);
  }

  /*
  Metodo para calcular el porcentaje de avance del alumno en el curso
  */
  public percentTrack(){
    this._cursosService.getCourses(this.token).subscribe(data=>{
      let res = data.message;
      for(let curso of res.groups){
        if(curso.courseid == this.courseid){
          this.trackPercent = curso.track;
        }
      }
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para hacer el calculo de las lecciones vistas en base al track
  */
  public observable(data:any){
    this.arrayblocks = data.message.groups;
    for(let crs of this.arrayblocks){
      let id = crs.groupid;
      if(id==this.groupid){
        this._cursosService.showBlocksTrack(id, this.token).subscribe(this.verNumeros.bind(this), this.catchError.bind(this));
      }
    }
  }

  /*

  */
  public verNumeros(data:any){
    let avT=0;
    this.testn = data.message.blockNum;
    this.contentblock = data.message.blocks;
    for (let _idT of this.contentblock) {
      let nT = _idT.track;
      if(nT){
        avT++
      }
    }
    let percent = 100/this.testn;
    this.trackPercent = avT*percent;
  }

  /*
  funcion para cerrar los modals del componente
  */
  closeDialog(){
    this.closemodal.dismiss();
  }
  /*
  Metodo para mostrar los errores en consola
  */
  public catchError(err){
    console.log(err);
  }

  /*
  Metodo para agregar las dudas y comentarios
  */
  setDoubt(title:any, descr:any){
    this.doubt= new Doubt(this.courseid,this.groupid,'root',title,descr,'discussion');
    this._cursosService.setDiscusion(this.doubt).subscribe(data=>{
      this._cursosService.getDiscussionCourse(this.courseid, this.groupid).subscribe(data=>{
        console.log(data);
        this.discussions = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }

  /*
  Metodo para agregar un comentario a una discusion del tema
  */
  setComment(descr:any){
    if(this.blockcomment){
      this.comment = new Comment(this.courseid,this.groupid,'comment',this.rootcomment,this.replytocomment,descr, this.blockcomment);
    }else{
      this.comment = new Comment(this.courseid,this.groupid,'comment',this.rootcomment,this.replytocomment,descr);
    }
    this._cursosService.setDiscusion(this.comment).subscribe(data=>{
      this._cursosService.getCommentsCourses(this.courseid, this.groupid).subscribe(data=>{
        this.comments = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }

  /*
  Metodo para agregar una respuesta de un comentario
  */
  setReply(text:any){
    if(this.blockreply){
      this.reply = new Reply(this.courseid,this.groupid,'reply',this.rootreply,this.commentidreply,this.replytoreply,text, this.blockreply);
    }else{
      this.reply = new Reply(this.courseid,this.groupid,'reply',this.rootreply,this.commentidreply,this.replytoreply,text);
    }
    this._cursosService.setReplytto(this.reply).subscribe(data=>{
      this._cursosService.getReplysCourses(this.courseid,this.groupid).subscribe(data=>{
        this.replys = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }
}
