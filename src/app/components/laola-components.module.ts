import { NgModule } from '@angular/core';
import { LaolaPaginationComponent } from './laola-pagination/laola-pagination.component';
import { LaolaSearchComponent } from './laola-search/laola-search.component';

import { SharedModule } from '../shared/shared.module'; 


@NgModule({

  declarations: [
    LaolaPaginationComponent, 
    LaolaSearchComponent
  ],
  exports: [   
    LaolaPaginationComponent, 
    LaolaSearchComponent
  ],
  imports: [
    SharedModule
  ]
  
})
export class LaolaComponentsModule {
}
