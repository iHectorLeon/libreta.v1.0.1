import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { LoaderService } from './loader.service';
import { LoaderState } from './loader';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit {
  loading:boolean = false;
  private subscription:Subscription

  constructor(private loaderService:LoaderService) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState.subscribe((state:LoaderState)=>{
      this.loading = state.show;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
