import { Component, OnInit, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { LaolaFileApiService } from '../../../../services/laola-file-api/laola-file-api.service';
import { VideogularService } from '../../../../services/videogular/videogular.service';

import { ILaolaFileMeta } from '../../../../models/laola-file-meta.model'; 

@Component({
    templateUrl: 'overview.component.html',
    styleUrls: ['overview.component.scss']
}) 
export class OverviewComponent implements AfterContentInit, OnInit {
 
    pageItems$!: BehaviorSubject<ILaolaFileMeta[]>; 
 
    constructor(
        private translate: TranslateService,
        public laolaFileApi: LaolaFileApiService,
		public videogularService: VideogularService,
		public cdr: ChangeDetectorRef,
		private router: Router
    ) {

    }


    


    ngOnInit(): void {
    }
	
    ngAfterContentInit(): void {
        this.pageItems$ = new BehaviorSubject<ILaolaFileMeta[]>([]);

    }

    onSearch(searchTerm: string) {
        this.laolaFileApi.fetchFiles('course', searchTerm);
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
	
	showVideo(course: ILaolaFileMeta) { 
		this.router.navigate(["/courses/videos/video-detail/"+course.id]);
	}
	
	onPlayerReady(event: any) {
		this.videogularService.onPlayerReady(event);
	}

    onPageChanged(event: any) {
        this.pageItems$.next(event);
        this.cdr.detectChanges();
    }
}
