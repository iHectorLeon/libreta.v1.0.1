import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceisorgService } from './../../services/serviceisorg.service';
import { Angular2Csv } from 'angular2-csv';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { DatePipe, DecimalPipe, SlicePipe } from '@angular/common';

import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { IMGCONSTCONA } from './../../models/temp/imgconstancias';

type AOA = any[][];

@Component({
  selector: 'app-gradesbygroup',
  templateUrl: './gradesbygroup.component.html',
  providers:[ ServiceisorgService, DecimalPipe, DatePipe]
})
export class GradesbygroupComponent implements OnInit {

  public idgroup:any;
  public group:string;
  public roosterstudents:any[]=[];
  public data:AOA = [ [1, 2], [3, 4] ];
  public data2:AOA = []=[];
  public groupgrades:any[]=[];
  public course:string;
  public duration:any;
  public durationunit:any;
  public finalgrade:any;
  public imgconalogo:any;
  public loading:boolean = false;
  public beginDate:any;
  public endDate:any;
  public wopts:XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  public headersXlsx:any []=['Curso','RFC','Apellido Paterno','Apellido Materno','Nombre','correo electrónico','Avance del curso','Evaluación diagnostica','Evaluación intermedia','Evaluación final','Actividad final','Calificación final','Fecha de término'];

  constructor(private _router:Router, private _activeRouter:ActivatedRoute, private _srvirg:ServiceisorgService, public decimal:DecimalPipe, public datePipe:DatePipe, private spinner:Ng4LoadingSpinnerService) {
    this.imgconalogo = IMGCONSTCONA.imgconstancias2;
    this._activeRouter.params.subscribe( params =>{
      if(params['idgroup']!=null){
        this.idgroup = params['idgroup'];
      }
    });
  }

  ngOnInit() {
    this.loading = true;
    let tempArray:any[]=[];
    let name:any;
    let pivote:number=0;
    let grade1;
    let grade2;
    let grade3;
    let grade4;
    this.data2.push(this.headersXlsx);
    this._srvirg.getGradesforgroup(this.idgroup).subscribe(data=>{
      console.log(data);
      this.group = data.group;
      this.roosterstudents = data.roster;
      this.course = data.course;
      this.duration = data.courseDuration;
      this.durationunit = data.courseDurUnits;
      this.beginDate = data.beginDate;
      this.endDate = data.endDate;
      for(let item of data.roster){
        this.finalgrade = this.decimal.transform(item.finalGrade,'.0-2');
        this.groupgrades.push(item.grades);
        for(let idgrade of this.groupgrades){
          for(let idg of idgrade){
            if(pivote == 0){
              grade1 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            if(pivote == 1){
              grade2 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            if(pivote == 2){
              grade3 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            if(pivote == 3){
              grade4 = this.decimal.transform(idg.blockGrade,'.0-2');
            }
            pivote ++;
          }
          pivote = 0;
        }
        tempArray.push(this.course,item.rfc,item.fatherName,item.motherName,item.name, item.email, item.track, grade1, grade2, grade3, grade4, this.finalgrade, this.endDate);
        this.data2.push(tempArray);
        tempArray = [];
      }
      this.loading = false;
    },error=>{
      console.log(error);
    });
  }

  /*
  Metodo para exportar a xlsx
  */
  public getExceltest():void{
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data2);
		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		/* save to file */
		XLSX.writeFile(wb, this.course+'.xlsx');

  }

  /*
  Metodo para exportar a .csv
  */
  public getReportexcel(){
    let datagrade;
    let usersgrades:any[]=[];
    let grades:any[]=[];
    let grade1;
    let grade2;
    let grade3;
    let grade4;
    var head = ['Curso','RFC','Apellido Paterno','Apellido Materno','Nombre','Correo electrónico','Avance en este curso','Evaluación diagnóstica','Evaluación intermedia','Evaluación final','Actividad Adicional','Calificación final','Fecha de término'];
    var options={
      showLabels:true,
      showTitle:true,
      useBom:true
    };
    for(let item of this.roosterstudents){
      let pivote = 0;
      for(let itemgrade of item.grades){
        if(pivote==0){
          grade1 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        if(pivote==1){
          grade2 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        if(pivote==2){
          grade3 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        if(pivote==3){
          grade4 = this.decimal.transform(itemgrade.blockGrade,'.0-2');
        }
        pivote++;
      }
      datagrade = [this.course,item.rfc,item.fatherName, item.motherName,item.name,item.email, item.track,grade1,grade2,grade3,grade4,this.decimal.transform(item.finalGrade,'.0-2'),this.endDate];
      usersgrades.push(datagrade);
    }
    new Angular2Csv(usersgrades,this.course,{headers: (head)});
  }

  returnCharts(){
    this._router.navigate(['/charts']);
  }

  /*
  Metodo para la impresion masiva de los cursos
  */
  public printCertificatedMass(){
    this.loading = true;
    for(let id of this.roosterstudents){
      if(id.pass && id.passDate){
        this.getCertificated(id.name,id.fatherName,id.motherName,id.passDate,id.finalGrade);
      }
    }
    this.loading = false;
  }

  /*
  Metodo para imprimir la constancia
  */
  public getCertificated(name:string, fatherName:string, motherName:string, date:any, finalGrade:any){

      this.loading = true;
      let student = name+' '+fatherName+' '+motherName;
      let finalgrade = this.decimal.transform(finalGrade,'.0-2');
      let duracion = this.duration;

      var doc = new jsPDF();
      doc.addImage(this.imgconalogo,'png',5,0,200,300);
      // Seccion del nombre del alumno
      doc.setFont("georgia");
      doc.setFontType('bold');
      doc.setFontSize(24);
      doc.text(105,155,student,null,null,'center');

      //Seccion de la calificacion final del estudiante
      doc.setFont("georgia");
      doc.setFontType('bold');
      doc.setFontSize(11);
      doc.text(111,173,finalgrade,'center');

      //Seccion del nombre del curso
      doc.setFont("georgia");
      doc.setFontType('bold');
      doc.setFontSize(16);
      doc.text(105,181,'"'+this.course+'"',null,null,'center');

      //duracion del curso
      doc.setFont("georgia");
      doc.setFontType('regular');
      doc.setFontSize(12);
      doc.text(70,190,''+duracion+' '+this.durationunit);

      //fecha de termino del curso por parte del alumno

      /*
      doc.setFont("georgia");
      doc.setFontType('regular');
      doc.setFontSize(12);
      doc.text(114,190,this.beginDate+' al '+this.endDate);
      */
      this.loading = false;
      doc.save(student+"_"+this.course);

  }
}
