import { Component, OnInit } from '@angular/core';
import { NgbModule, NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Angular2Csv } from 'angular2-csv';

import { Reports } from './../../models/temp/reports';
import { ServiceisorgService } from './../../services/serviceisorg.service';

import * as jsPDF from 'jspdf';
import { IMGCONSTCONA } from './../../models/temp/imgconstancias';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  providers:[ServiceisorgService, DatePipe, DecimalPipe, SlicePipe]
})
export class ChartsComponent implements OnInit {

  public loading:boolean = false;
  public state:string;
  public orgUnitName:string;
  public blockreport:any[];
  public totalUsers:number;
  public totalUsersNoApproved:number;
  public usersOnTrack:number;
  public percentOnTrack:number;
  public usersPassed:number;
  public percentPassed:number;
  public usersInactives:number;
  public percentInactives:number;
  public registers:any[]=[];
  public gradesroster:any[]=[];

  public  grade1:number;
  public  grade2:number;
  public  grade3:number;
  public  grade4:number;

  public registerCharts:any[]=[];
  public barchartoptregister:any = {scaleShowVerticalLines: false,responsive: true};
  public barchartlabelregister:string[]=['Total de usuarios','Usuarios aprobados','Usuarios activos'];
  public barcharttyperegister:string = 'bar';
  public barchartlegendregister:boolean = false;
  public barchartcolorsregister:Array<any> = [
   {
     backgroundColor: ['rgba(194, 202, 198, 0.66)', 'rgba(144, 216, 238, 0.66)', 'rgba(144, 238, 159, 0.66)']
   }
  ];

  public barChartData:any=[{data:[]}];
  public barChartOptions:any = {scaleShowVerticalLines: false,responsive: true};
  public barChartLabels:string[]=['Total de usuarios','Usuarios Activos','Usuarios inactivos'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = false;
  public barChartColors:Array<any> = [
   {
     backgroundColor: ['rgba(194, 202, 198, 0.66)', 'rgba(144, 216, 238, 0.66)', 'rgba(219, 163, 178, 0.66)']
   }
  ];

  public doughnutChartDataPass:any=[{data:[]}];
  public doughnutChartLabelsPass:string[]=['Usuarios Aprobados','Usuarios sin aprobar'];
  public doughnutChartTypePass:string = 'doughnut';
  public doughnutChartColorPass:Array<any> = [
    {
      backgroundColor: ['rgba(144, 238, 159, 0.66)', 'rgba(194, 202, 198, 0.66)']
    }
  ];

  public barChartDataGradesbyRosters:any=[{data:[]}];
  public barChartOptionsGradesbyRosters:any = {scaleShowVerticalLines: true,responsive: true};
  public barChartLabelsGradesbyRosters:string[]=['Evaluación diagnóstica','Evaluación intermedia','Evaluación final','Actividad adicional'];
  public barChartTypeGradesbyRosters:string = 'bar';
  public barChartLegendGradesbyRosters:boolean = false;
  public barChartColorGradesbyRosters:Array<any> = [
    {
      backgroundColor: ['rgba(144, 238, 159, 0.66)', 'rgba(194, 202, 198, 0.66)', 'rgba(144, 216, 238, 0.66)', 'rgba(219, 163, 178, 0.66)']
    }
  ];

  public today = new Date();
  public reports:Reports;
  public reportsArray:Reports[]=[];
  public imgconalogo:any;
  public imglogo:any;

  public closemodal:NgbModalRef;


  constructor(private activatedRoute:Router, private modalService:NgbModal, private _srvirg:ServiceisorgService, public datePipe:DatePipe, public decimal:DecimalPipe, public slice:SlicePipe) {
    this.imgconalogo = IMGCONSTCONA.imglogo;
    this.imglogo = IMGCONSTCONA.imgcona;
  }
  ngOnInit() {
    this.getReports();
    this.getCharts();
  }

  /*
  Metodo para consultar los nuevos reportes
  */
  public getCharts(){
    var cont = 0;
    this.loading = true;
    this._srvirg.getCharts().subscribe(data=>{
      this.orgUnitName = data.orgUnitName;
      this.totalUsers = data.totalUsers;
      this.usersOnTrack = data.usersOnTrack;
      this.usersPassed = data.usersPassed;
      this.totalUsersNoApproved = this.totalUsers-this.usersPassed;
      this.usersInactives = this.totalUsers - this.usersOnTrack;
      this.percentOnTrack = (this.usersOnTrack/this.totalUsers)*100;
      this.percentInactives = (this.usersInactives/this.totalUsers)*100;
      this.percentPassed = (this.usersPassed/this.totalUsers)*100;
      this.barChartData = [this.totalUsers, this.usersOnTrack,this.usersInactives];
      this.doughnutChartDataPass = [this.usersPassed, this.totalUsersNoApproved];
      this.registers = data.results;

      for(let id of this.registers){
        if(id.usersPassed==null){
          var values = [id.totalUsers,0,id.usersOnTrack];
          this.registerCharts.push(values);
        }else{
          var values = [id.totalUsers,id.usersPassed,id.usersOnTrack];
          this.registerCharts.push(values);
        }
      }

    },error=>{
      console.log(error);
    });
    this._srvirg.getGradesbyou().subscribe(data=>{
      this.gradesroster = data.message;
      console.log(this.gradesroster);
      for(let idgrade of this.gradesroster){
        if(cont == 0){
          this.grade1 = idgrade.total;
        }
        if(cont == 1){
          this.grade2 = idgrade.total;
        }
        if(cont == 2){
          this.grade3 = idgrade.total;
        }
        if(cont == 3){
          this.grade4 = idgrade.total;
        }
        cont++;
      }
      this.barChartDataGradesbyRosters = [this.grade4,this.grade3,this.grade2,this.grade1];
      this.loading = false;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para imprimir la constancia
  */
  public getCertificated(student:any, course:any, duration:any, date:any, durationUnit:any){

      let dateFormat = this.datePipe.transform(date, 'dd/MM/yyyy');
      let duracion = duration;

      var doc = new jsPDF();
      doc.addImage(this.imgconalogo,'jpg',5,0,200,300);
      // Seccion del nombre del alumno
      doc.setFont("georgia");
      doc.setFontType('bold');
      doc.setFontSize(24);
      doc.text(105,150,student,null,null,'center');

      //Seccion del nombre del curso
      doc.setFont("georgia");
      doc.setFontType('bold');
      doc.setFontSize(16);
      doc.text(105,182,'"'+course+'"',null,null,'center');

      //duracion del curso
      doc.setFont("georgia");
      doc.setFontType('regular');
      doc.setFontSize(12);
      doc.text(118,188,''+duracion+' '+durationUnit);

      //fecha de termino del curso por parte del alumno
      doc.setFont("georgia");
      doc.setFontType('regular');
      doc.setFontSize(11);
      doc.text(105,201,dateFormat,null,null,'center');

      doc.save(student+"_"+course);
  }

  /*
  funcion para generar los reportes en tiempo real que ve el usuario tipo isOrg
  */
  public getReports(){
    this._srvirg.getReportsOrg().subscribe(data=>{
      this.state = data.state;
      this.blockreport  = data.message;
    },error=>{
      console.log(error);
    });
  }

  /*
  funcion para imprimir los reportes en pdf
  */
  getReportpdf(itemReport:any){
    let plantel = itemReport.orgUnit;
    let group = itemReport.group;
    let averageGroup = this.decimal.transform(itemReport.averageGrade ,'1.0-2');
    let trackGroup = this.decimal.transform(itemReport.averageTrack ,'1.0-2');
    let course = itemReport.course;
    let durationCourse = itemReport.duration;
    let unitDuration = itemReport.durationUnits;
    let studentsinsc = itemReport.totalStudents;
    let performance =  this.slice.transform(itemReport.efectiveness,0,5); //itemReport.efectiveness;
    let students = itemReport.grades;
    var doc = new jsPDF('landscape');

    //encabezados del reporte

    doc.addImage(this.imglogo,'jpg',20,5,25,15);
    doc.setFont("georgia");
    doc.setFontType('bolditalic');
    doc.setFontSize(20);
    doc.text(150,15,'Dirección de Servicios Tecnológicos y de Capacitación Conalep',null,null,'center');

    doc.setLineWidth(0.5);
    doc.line(20,23,280,23);

    //Datos del plantel
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(15);
    doc.text(20,30,"Plantel: ");

    doc.setFont("georgia");
    doc.setFontSize(15);
    doc.setTextColor(150);
    doc.text(40,30,plantel);

    //Datos del grupo
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(15);
    doc.setTextColor(0);
    doc.text(20,40,"Grupo: ");

    doc.setFont("georgia");
    doc.setFontSize(15);
    doc.setTextColor(150);
    doc.text(40,40,group);

    //datos del curso
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(15);
    doc.setTextColor(0);
    doc.text(100,40,"Curso: ");

    doc.setFont("georgia");
    doc.setFontSize(15);
    doc.setTextColor(150);
    doc.text(118,40,course);

    //alumnos inscritoss
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(20,50,"Alumnos Inscritos: ");

    doc.setFont("georgia");
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text(57,50,''+studentsinsc);

    //promedio grupal
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(90,50,"Promedio grupal: ");

    doc.setFont("georgia");
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text(125,50,''+averageGroup);

    //avance grupal
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(140,50,"Avance grupal: ");

    doc.setFont("georgia");
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text(170,50,'' + trackGroup);

    //Rendimiento grupal
    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(190,50,"Rendimiento: ");

    doc.setFont("georgia");
    doc.setFontSize(12);
    doc.setTextColor(150);
    doc.text(218,50,''+performance);

    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text(20,60,"Listado de Alumnos");

    doc.setLineWidth(1.5);
    doc.line(20,65,280,65);

    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(30,70,"Nombre");

    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(100,70,"Avance del curso");

    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(150,70,"Calificación final");

    doc.setFont("georgia");
    doc.setFontType('bold');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(200,70,"Estatus");

    doc.setLineWidth(1.5);
    doc.line(20,75,280,75);

    let inicioName = 20;
    let inicioAvance = 110;
    let inicioCalificacion = 160;
    let inicioEstatus = 200;

    let inicioY = 80;
    let account = 0;
    let rowsforpage = 25;
    for(let idstudent of students){
      if(account==rowsforpage){
        //agregamos una nueva pagina
        doc.addPage([0,210]);

        //encabezados de la nueva pagina
        doc.addImage(this.imglogo,'jpg',20,5,25,15);
        doc.setFont("georgia");
        doc.setFontType('bolditalic');
        doc.setFontSize(20);
        doc.text(150,15,'Dirección de Servicios Tecnológicos y de Capacitación Conalep',null,null,'center');

        doc.setLineWidth(1.5);
        doc.line(20,25,280,25);

        doc.setFont("georgia");
        doc.setFontType('bold');
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(30,30,"Nombre");

        doc.setFont("georgia");
        doc.setFontType('bold');
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(100,30,"Avance del curso");

        doc.setFont("georgia");
        doc.setFontType('bold');
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(150,30,"Calificación final");

        doc.setFont("georgia");
        doc.setFontType('bold');
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(200,30,"Estatus");

        doc.setLineWidth(1.5);
        doc.line(20,35,280,35);
        account=0;
        rowsforpage=30;
        inicioY = 40;
      }
      doc.text(inicioName, inicioY, idstudent.studentName);
      doc.text(inicioAvance, inicioY,''+idstudent.track+' %');
      doc.text(inicioCalificacion, inicioY,''+idstudent.finalGrade);
      if(idstudent.pass){
        doc.text(inicioEstatus, inicioY, "Aprobado");
      }else{
        doc.text(inicioEstatus, inicioY, "No Aprobado");
      }
      inicioY = inicioY+5;
      account = account+1;
    }
    doc.save(group);
  }

  /*
  función para imprimir el reporte en excel
  */
  getReportexcel(itemReport){
    this.reportsArray = [];
    var head = ['Nombre del Alumno','Correo electrónico','Avance del curso', 'Calificación final', 'Estatus','Grupo','Curso','Fecha de termino'];
    var options={
      showLabels:true,
      showTitle:true,
      useBom:true
    };
    for(let item of itemReport.grades){
      if(item.pass){
        this.reports = new Reports(item.studentName,item.username, item.track, item.finalGrade,'Aprobado', itemReport.group, itemReport.course,this.datePipe.transform(item.passDate, 'dd/MM/yyyy'));
      }else{
        this.reports = new Reports(item.studentName,item.username, item.track, item.finalGrade,'No Aprobado', itemReport.group, itemReport.course,'');
      }
      this.reportsArray.push(this.reports);
    }
    new Angular2Csv(this.reportsArray,itemReport.group,{headers: (head)});
  }

  /*
  Metodo para obtener el reporte de los usuarios inactivos
  */
  getUserInactives(){
    this._srvirg.getUserInactives().subscribe(data=>{
      let usersInactives:any[]=[];
      var head = ['Grupo/Curso','Apellido Paterno','Apellido Materno', 'Nombre', 'Correo electrónico'];
      var options={
        showLabels:true,
        showTitle:true,
        useBom:true
      };
      for(let item of data){
        usersInactives.push(item);
      }
      new Angular2Csv(usersInactives,"Usuarios Inactivos",{headers: (head)});
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para obtener las calificaciones por grupo
  */
  getGradesforgroup(idgroup:any){
    this.activatedRoute.navigate(['/gradesbygroup',idgroup]);
  }

  /*
  funcion para mostrar el grupo seleccionado
  */
  showGroup(content){
    this.closemodal = this.modalService.open(content, {size: 'lg'});
  }

  /*
  funcion para cerrar el modal
  */
  closeDialog(){
    this.closemodal.dismiss();
  }

}
