import { NgModule } from '@angular/core';
import { PerformancesRoutingModule } from './performances-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CollapseModule } from '@coreui/angular'; 
import { PerformancesVideosModule } from './videos/performances-videos.module';  

@NgModule({
  declarations: [ 
	
  ],
  imports: [
    PerformancesRoutingModule, 
    CollapseModule, 
    SharedModule, 
	PerformancesVideosModule, 
    SharedModule
  ],
  
})
export class PerformancesModule {
}
