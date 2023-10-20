import { Component, OnInit, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { LaolaFileApiService } from '../../../../services/laola-file-api/laola-file-api.service';
import { VideogularService } from '../../../../services/videogular/videogular.service';

import { ILaolaFileMeta } from '../../../../models/laola-file-meta.model'; 

@Component({
    templateUrl: 'performances-overview.component.html',
    styleUrls: ['performances-overview.component.scss']
}) 
export class PerformancesOverviewComponent implements AfterContentInit, OnInit {
 
    pageItems$!: BehaviorSubject<ILaolaFileMeta[]>; 
 
    constructor(
        public laolaFileApi: LaolaFileApiService,
		public videogularService: VideogularService,
		public cdr: ChangeDetectorRef,
		private router: Router
    ) {

    }


    ngOnInit(): void {
        console.error("Performance!!!");
    }
	
    ngAfterContentInit(): void {
        this.pageItems$ = new BehaviorSubject<ILaolaFileMeta[]>([]);

    }

    onSearch(searchTerm: string) {
        this.laolaFileApi.fetchFiles('performance', searchTerm);
    }

	deleteVideo(course: ILaolaFileMeta) {
		this.laolaFileApi.deleteFile(course).then((res) => {
			console.log("res",res, course.id)
		}); 
	}
	
	downloadVideo(course: ILaolaFileMeta) {
		this.laolaFileApi.downloadFile(course).then((res) => {
			console.log("res", course )
		}); 
	}
	
	stopVideo() {
		this.videogularService.stopVideo();
	}
	
	getVideo(course: ILaolaFileMeta) {
		this.laolaFileApi.downloadFile(course).then((res) => { 
		}); 
	}
	
	showVideo(performance: ILaolaFileMeta) { 
		this.router.navigate(["/performances/videos/performances-video-detail/"+performance.id]);
	}
	
	onPlayerReady(event: any) {
		this.videogularService.onPlayerReady(event);
	}

    onPageChanged(event: any) {
        this.pageItems$.next(event);
        this.cdr.detectChanges();
    }
}
