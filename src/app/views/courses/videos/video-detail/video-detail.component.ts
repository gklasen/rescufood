import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'; 
 
import { LaolaFileApiService } from '../../../../services/laola-file-api/laola-file-api.service';
import { VideogularService } from '../../../../services/videogular/videogular.service'; 

import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
    templateUrl: 'video-detail.component.html',
    styleUrls: ['video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit {  
	@ViewChild('media')
	media!: ElementRef;

	videoUrl: any

    constructor( 
        public laolaFileApi: LaolaFileApiService,
		public videogularService: VideogularService,
		private router: Router,
		private http: HttpClient
    ) { 
    }

    ngOnInit(): void {
		
    }
	
 
	stopVideo() {
		this.videogularService.stopVideo();
	}
 
	onPlayerReady(event: any) {
		this.videogularService.onPlayerReady(event);
		 this.loadVideo();
	}
	loadVideo() {
		const selectedCourseId = this.router.url.split('/').pop()!;	
			this.videoUrl = this.laolaFileApi.streamVideo(selectedCourseId);
			this.http.get(this.videoUrl, {  responseType: 'blob' }).subscribe(
			(response: Blob) => {
			  const blobUrl = URL.createObjectURL(response);
			  this.media.nativeElement.src = blobUrl;
			  this.videogularService.api.getDefaultMedia().play();
			},
			(error) => {
			  console.error('Error streaming video:', error);
			}
		  );
	  }
}
