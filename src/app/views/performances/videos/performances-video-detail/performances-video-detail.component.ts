import { Component, OnInit } from '@angular/core'; 
 
import { LaolaFileApiService } from '../../../../services/laola-file-api/laola-file-api.service';
import { VideogularService } from '../../../../services/videogular/videogular.service'; 

import { Router } from '@angular/router';

@Component({
    templateUrl: 'performances-video-detail.component.html',
    styleUrls: ['performances-video-detail.component.scss']
})
export class PerformancesVideoDetailComponent implements OnInit {  

    constructor( 
        public laolaFileApi: LaolaFileApiService,
		public videogularService: VideogularService,
		private router: Router
    ) { 
    }

    ngOnInit(): void {
		
    }
	
	getVideoSource() {
		const selectedCourseId = this.router.url.split('/').pop()!;
		return this.laolaFileApi.generateViewPath(selectedCourseId);
	}
 
	stopVideo() {
		this.videogularService.stopVideo();
	}
 
	onPlayerReady(event: any) {
		this.videogularService.onPlayerReady(event);
	}
}
