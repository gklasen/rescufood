import { NgModule } from '@angular/core';
import { PerformancesVideosRoutingModule } from './performances-videos-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CollapseModule } from '@coreui/angular';

import { PerformancesOverviewComponent } from './performances-overview/performances-overview.component';  
import { PerformancesVideoDetailComponent } from './performances-video-detail/performances-video-detail.component'; 
 
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering'; 

import { LaolaComponentsModule } from '../../../components/laola-components.module';  

@NgModule({
  declarations: [
	PerformancesOverviewComponent,
	PerformancesVideoDetailComponent
  ],
  imports: [
    PerformancesVideosRoutingModule, 
    CollapseModule,
    SharedModule,
	VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule, 
    LaolaComponentsModule  
  ],
  
})
export class PerformancesVideosModule {
}
