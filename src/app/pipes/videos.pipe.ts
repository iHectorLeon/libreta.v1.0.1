import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'videos'
})
export class VideosPipe implements PipeTransform {

  constructor(private dms:DomSanitizer){

  }
  transform(value: string): any {
    //let url = "https://www.youtube.com/embed/";
    console.log(value);
    return this.dms.bypassSecurityTrustResourceUrl(value);
  }

}
