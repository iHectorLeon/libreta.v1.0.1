import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CourseService } from './../../services/course.service';
import { UserService } from './../../services/user.service';

import { Answers } from './../../models/temp/answers';
import { AnswersTemp } from './../../models/temp/answersTemp';
import { AnswersMG } from './../../models/temp/answersMG';
import { Attemp } from './../../models/course/attemp';
import { Doubt } from './../../models/temp/doubt';
import { Comment} from './../../models/course/comment';
import { Task } from './../../models/temp/task'
import { TaskEntry } from './../../models/course/task';
import { Discussion } from './../../models/course/discussion';
import { Reply } from './../../models/course/reply';

declare var $:any;

@Component({

  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  providers:[CourseService, UserService]

})
export class BlocksComponent implements OnInit{

  public token;
  public block:string;
  public blockTitle:string;
  public blockNext:string;
  public blockPrev:string;

  public groupid:string;
  public courseid:string;
  public blockid:string;
  public blockidTo:string;
  public blockList:any=[];

  public blocContent:string;
  public blockSection:string;
  public blockNumber:string;
  public blockType:string;
  public blockCode:string;
  public bloccoursecode:string;
  public blocgroupcode:string;
  public blockmessageUser:string;
  public blockBegin:boolean;
  public blockTask:any[];
  public blockMedia:any[];
  public blockDiscussion:any[];
  public blockComments:any[];
  public blockReplys:any[];
  public blockButtonNext:boolean;
  public blockmessage_error:string;
  public lastTaskDate:any;
  public lastTaskDelivered:any;
  public blockQuiz:any[];
  public blockResources:any[];
  public beginQuiz:boolean;
  public questionsBlock:any[]=[];

  public mapquiz:AnswersTemp;
  public doubt:Doubt;
  public task:TaskEntry;
  public discussion:Discussion;
  public replyEnt:Reply;
  public comment:Comment;
  public reply:Reply;
  public taskStudent:Task[]=[];
  public closemodal:NgbModalRef;

  public rootcomment:any;
  public replytocomment:any;

  public rootreply:any;
  public commentidreply:any;
  public replytoreply:any;

  public answerStudent:Answers[]=[];
  public answersArray:Answers[]=[];
  public answersArrayMG:AnswersMG[]=[];
  public answerStudentMG:AnswersMG[]=[];
  public answerstxttMG:AnswersMG;
  public attemp:Attemp;
  public weight:number;
  public grade:number;
  public questionBegin:number;
  public grademinimun:number;
  public maxAttempts:number;
  public totalattemp:number;
  public gradefinal:number;
  public resutlquestion:boolean;
  public label:string;
  public isValidateAttemp:boolean = false;
  public isSendTask:boolean = false;

  public urlYouTube:string;
  public cursoVideo:string;
  public vervideo:boolean = false;
  public videoCurso: any[]=[];
  public videoId:any;
  public videoSel:any;
  public page:number = 1;
  public temary:boolean = false;
  public isAttachmen:boolean = false;

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, public _course:CourseService, private _user:UserService, private modalService:NgbModal, private domnsanitizer:DomSanitizer) {
    this.token = this._user.getToken();
    this.mapquiz = new AnswersTemp('');
    this.task = new TaskEntry('','',null);
    this._activeRouter.params.subscribe( params =>{
      if(params['curso']!=null){
        this.block=params['curso'];
      }
      if(params['groupid']!=null){
        this.groupid=params['groupid'];
      }
      if(params['courseid']!=null){
        this.courseid=params['courseid'];
      }
      if(params['blockid']!=null){
        this.blockid=params['blockid'];
      }
    });
  }

  ngOnInit() {
    this.token = this._user.getToken();
    this.isSendTask = false;
    this.getBlock(this.blockid,true);
    this._course.showBlocksTrack(this.groupid, this.token).subscribe(data=>{
        let objr = data.message.blocks;
        this.blockList = objr;
    },error=>{
      console.log(error)
    });
    this._course.getReources(this.groupid, this.token).subscribe(data=>{
      this.blockResources = data.message;
    },error=>{
      console.log(error);
    });
    this.answerStudent = []=[];
  }

  /*
  para usar el api y guardar las tareas
  */
  public sendTask(force:boolean){
    if(force){
      this.task = new TaskEntry(this.groupid,this.blockidTo,this.taskStudent,force);
    }else{
      this.task = new TaskEntry(this.groupid,this.blockidTo,this.taskStudent);
    }
    this._course.setTasks(this.task).subscribe(data => {
      this.isSendTask = true;
    },error=>{
      console.log(error);
      this.isSendTask = false;
    });
    this.task = new TaskEntry('','',null);
    this.closeDialog();
  }

  /*
  subir archivos de las tareas
  */
  public uploadFile($event,label:number){
    this.blockmessageUser = null;
    this.blockmessage_error = null;
    this.isAttachmen = false;
    if($event.target.files.length === 1 && $event.target.files[0].size <= 1048576){
      this._course.setAttachment($event.target.files[0],this.bloccoursecode ,this.blocgroupcode, this.token).subscribe(data=>{
        this.blockmessageUser = "Se cargo el archivo correctamente"
        this.setTask(data.fileId,'file',label);
      },error=>{
        console.log(error);
      });
    }else{
      this.blockmessage_error = "El archivo no puede ser mayor a 1 MB"
    }
  }

  /*
  Metodo para setear las tareas del usuario
  */
  public setTask(content:any,type:any,label:number){
    if( this.taskStudent.find(id => id.label === label) ){
      let indexRepeat = this.taskStudent.indexOf(this.taskStudent.find(id => id.label === label));
      this.taskStudent.splice(indexRepeat,1);
      this.taskStudent.push({ content,type,label});
      this.isAttachmen = true;
    }else{
      this.taskStudent.push({content,type,label});
      this.isAttachmen = true;
    }
  }


  /*
  Metodo para calificar las preguntas del estudiante
  */
  public checkAnswersStudent(){
    this.gradefinal = 0;
    let answers:any []=[];

    if(this.answersArray.length > 0){
      for(let idAnsArr of this.answersArray){
        for(let idAnsStu of this.answerStudent){
          if(idAnsArr.idquestion == idAnsStu.idquestion){
            answers.push(idAnsStu.answer);
            if(idAnsArr.answer == idAnsStu.answer){
              this.gradefinal ++;
            }
          }
        }
      }
    }

    if(this.answersArrayMG.length >0){
      for(let idAnsArr of this.answersArrayMG){
        for(let idAnsStu of this.answerStudentMG){
          if(idAnsArr.idquestion == idAnsStu.idquestion && idAnsArr.index == idAnsStu.index){
            answers.push(idAnsStu.answer);
            if(Array.isArray(idAnsArr.answer)){
              for(let ans of idAnsArr.answer){
                if(this.filterString(ans) == this.filterString(idAnsStu.answer)){
                  this.gradefinal ++;
                }

              }
            }else{
              if(this.filterString(idAnsArr.answer) == this.filterString(idAnsStu.answer)){
                this.gradefinal ++;
              }
            }
          }
        }
      }
    }

    this.grade = this.gradefinal*this.weight;
    if(this.grade>=this.grademinimun){
      this.resutlquestion = true;
    }else{
      this.resutlquestion = false;
    }
    this.attemp = new Attemp(this.groupid, this.blockidTo, answers, this.grade);
    this._course.setAttempt(this.attemp).subscribe(data=>{
      this.totalattemp++;
      if(this.maxAttempts === this.totalattemp){
        this.isValidateAttemp = false;
      }else{
        this.isValidateAttemp = true;
      }
    },error=>{
      console.log(error);
    });
  }

  /*
  metodo para agregar las respuestas tipo map
  */
  public getAnswersMap(idquestion:number, answer:string, index:any){
    if(this.answerStudentMG.length > 0){
      if(this.answerStudentMG.find(id => id.idquestion == idquestion && id.index == index)){
        let indexRepeat = this.answerStudentMG.indexOf(this.answerStudentMG.find(id => id.idquestion == idquestion && id.index == index));
        this.answerStudentMG.splice(indexRepeat,1);
        this.answerStudentMG.push({ idquestion, answer, index});
      }else{
        this.answerStudentMG.push({idquestion,answer, index});
      }
    }else{
      this.answerStudentMG.push({idquestion,answer,index});
    }
  }

  /*
  Metodo para agregar las respuestas a un arreglo de tipo any
  */
  public getAnswer(idquestion:number, answer:string){
    if(this.answerStudent.length > 0){
      if(this.answerStudent.find(id => id.idquestion == idquestion)){
        let indexRepeat = this.answerStudent.indexOf(this.answerStudent.find(id => id.idquestion == idquestion));
        this.answerStudent.splice(indexRepeat,1);
        this.answerStudent.push({ idquestion, answer});
      }else{
        this.answerStudent.push({idquestion,answer});
      }
    }else{
      this.answerStudent.push({idquestion,answer});
    }
  }

  /*
  Metodo para traer las respuestas del cuestionario
  */
  public questions(data:any){

    let idquestion = 0;
    let index = 0;
    let arrayTemp:any []=[];
    let arrayTempMG:any []=[];
    let questionBegin = data.begin;

    this.grademinimun = data.minimum;
    this.maxAttempts = data.maxAttempts
    this.questionsBlock = data.questions;

    if(this.maxAttempts === this.totalattemp){
      this.isValidateAttemp = false;
    }else{
      this.isValidateAttemp = true;
    }

    for(let id of this.questionsBlock){
      let pivote = id.answers;
      let label = id.label;
      if(label!=null){
        this.label = label
      }else{
        this.label = null
      }
      for(let idp of pivote){
        if(idp.index!=null){
          let answer = idp.index;

          arrayTemp.push({idquestion, answer});
          idquestion++;
          index++;
        }
        if(idp.tf){
          let answer = idp.tf;

          arrayTemp.push({idquestion,answer});
          idquestion++;
          index++;
        }
        if(idp.text){
          let answer=idp.text;

          arrayTemp.push({idquestion,answer});
          idquestion++;
          index++;
        }
        if(idp.group){
          idquestion=0;
          for(let answer of idp.group){
            arrayTempMG.push({idquestion,answer,index});
            idquestion++;
          }
          index++
        }
      }
    }
    if (arrayTemp.length > 0) {
      this.answersArray = arrayTemp;
      this.weight = this.answersArray.length;
      this.weight = 100/this.weight;
    }
    if (arrayTempMG.length > 0) {
      this.answersArrayMG = arrayTempMG;
      this.weight = this.answersArrayMG.length;
      this.weight = 100/this.weight;
    }
  }

  /*
  Metodo para ir al temario del curso
  */
  public goModules(){
    this._router.navigate(['/modules',this.block,this.groupid,this.courseid]);
  }

  /*
  funcion para mostrar el contenido de los recursos
  */
  public showResources(content){
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }

  /*
  funcion que muestra el modal de agregar un root de duda o comentario
  */
  public shownewDoubt(content){
    this.closemodal = this.modalService.open(content);
  }
  /*
  Funcion que muestra el modal del temario
  */
  public showTemary(content){
    this.closemodal = this.modalService.open(content);
    this.temary = true;
  }

  /*
  Funcion de modal para validar las respuestas del usuario
  */
  public showAccept(content){
    this.closemodal = this.modalService.open(content);
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showComment(content, id_root){
    this.closemodal = this.modalService.open(content);
    this.rootcomment = id_root;
    this.replytocomment = id_root;
  }

  /*
  Funcion que muestra el modal para agregar un comentario
  */
  public showReply(content, id, root){
    this.closemodal = this.modalService.open(content);
    this.replytoreply = id;
    this.rootreply = root;
    this.commentidreply = id;
  }

  /*
  Metodo para cerrar el modal del cuestionario
  */
  closeDialog(){
    this.closemodal.dismiss();
  }

  /*
  Metodo para ir a un bloque desde el temario
  */
  getBlock(id:string, prev:boolean){
    this.token = this._user.getToken();
    this.isSendTask = false;
    this._course.getBlock(this.groupid, this.courseid, id, prev).subscribe(data=>{
      this.blockidTo = id;
      let objr = data.message;
      this.blockmessageUser = data.messageUser;
      this.blockCode    = objr.blockCode;
      this.blockBegin = objr.blockBegin;
      this.blockType    = objr.blockType;
      this.blockTitle  = objr.blockTitle
      this.blocContent = objr.blockContent;
      this.blockNext   = objr.blockNextId;
      this.blockPrev   = objr.blockPrevId;
      this.blockSection= objr.blockSection;
      this.blockNumber = objr.blockNumber;
      this.blockQuiz   = objr.questionnarie;
      this.blockMedia = objr.blockMedia;
      this.blockTask = objr.tasks;
      this.totalattemp = objr.attempts;
      this.lastTaskDate = objr.lastTaskDate;
      this.lastTaskDelivered = objr.lastTaskDelivered;
      this.bloccoursecode = objr.courseCode;
      this.blocgroupcode = objr.groupCode;

      if(this.blockQuiz!=null){
        this.questions(this.blockQuiz);
      }
      if(this.blockMedia && this.blockMedia.length != 0){
        this.vervideo = true;
      }else{
        this.vervideo = false;
      }
      this._course.getDiscussion(this.blockidTo).subscribe(data=>{
        this.blockDiscussion = data.message;
      },error=>{
        console.log(error);
      });
      this._course.getCommentsBlock(this.blockidTo).subscribe(data=>{
        this.blockComments = data.message;
      },error=>{
        console.log(error);
      });
      this._course.getReplysBlock(this.blockidTo).subscribe(data=>{
        this.blockReplys = data.message;
      },error=>{
        console.log(error);
      });
      this._course.getReources(this.groupid, this.token).subscribe(data=>{
        this.blockResources = data.message;
      },error=>{
        console.log(error);
      });
      this._course.showBlocksTrack(this.groupid, this.token).subscribe(data=>{
          let objr = data.message.blocks;
          this.blockList = objr;
      },error=>{
        console.log(error)
      });
    },error=>{
      console.log(error);
      this.blockButtonNext = false;
      let message_error = error._body
      if(message_error.includes("messageUser")){
        let beginm = message_error.indexOf('"messageUser":"');
        let endmm = message_error.indexOf('"}');
        let finalmsn = message_error.substring(beginm+15,endmm);
        this.blockmessage_error = finalmsn;
      }
    });

    this.answerStudent = []=[];

    if(this.temary){
      this.closeDialog();
    }

  }

  /*
  Metodo para agregar las dudas y comentarios
  */
  setDoubt(title:any, descr:any){
    this.doubt= new Doubt(this.courseid,this.groupid,'root',title,descr,'discussion',this.blockidTo);
    this._course.setDiscusion(this.doubt).subscribe(data=>{
      this._course.getDiscussion(this.blockidTo).subscribe(data=>{
        this.blockDiscussion = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }

  /*
  Metodo para agregar comentarios a la sección de dudas y comentarios del bloque
  */
  setComment(descr:any){
    this.comment = new Comment(this.courseid,this.groupid,'comment',this.rootcomment,this.replytocomment,descr,this.blockidTo);
    this._course.setDiscusion(this.comment).subscribe(data=>{
      this._course.getCommentsBlock(this.blockidTo).subscribe(data=>{
        this.blockComments = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }

  /*
  Metodo para agregar las respuestas de los comentarios
  */
  setReply(text:any){
    this.reply = new Reply(this.courseid,this.groupid,'reply',this.rootreply,this.commentidreply,this.replytoreply,text,this.blockidTo);
    this._course.setReplytto(this.reply).subscribe(data=>{
      this._course.getReplysBlock(this.blockidTo).subscribe(data=>{
        this.blockReplys = data.message;
      },error=>{
        console.log(error);
      });
    },error=>{
      console.log(error);
    });
    this.closeDialog();
  }
  /*
  Funcion para retornar al curso en seguimiento
  */
  public returnCourse(){
    this._router.navigate(['/mycourses',this.block,this.groupid,this.courseid,this.blockid]);
  }

  /*
  Funcion para imprimir errores en la lectura de cursos
  */
  public catchError(err){
    console.log(err);
  }

  /*
  funcion para quitar los espacios en blanco, capitalizar y unificar un solo simbolo
  */
  public filterString(value:any):any{
    if(value >= 0){
      value = value;

    }else{
      if(value.includes("'")){
        value = value.replace("'","´")
      }
      if(value.includes("`")){
        value = value.replace("`","´")
      }
      if(value.includes("’")){
        value = value.replace("’","´")
      }
      value = value.replace(' ´','´');
      value = value.replace('´ ','´');
      value = value.replace(' ´ ','´');
      value = value.toLowerCase();
    }
    return value;
  }
}
