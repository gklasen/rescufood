import { Component, OnDestroy, OnInit } from '@angular/core';
import { LaolaFileApiService } from '../../../services/laola-file-api/laola-file-api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { IFileUpload } from 'src/app/models/file-upload.model';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    templateUrl: 'file-upload.component.html',
    styleUrls: ['file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {

    public type: string = "course"; 
    private file: File | null;
    public uploadRunning$: BehaviorSubject<boolean>; 
    public uploaded = false;
    subscriptions: Subscription[] = []
    public uploadForm = this.formBuilder.group({
        titleInput: ['', Validators.required],
        fileInput: ['', Validators.required],
        commentInput: ['', Validators.required]
    });

    constructor(
        private formBuilder: FormBuilder,
        public laolaFileApi: LaolaFileApiService
    ) {
        this.file = null; 
        this.uploadRunning$ = new BehaviorSubject<boolean>(false);
    }



    ngOnInit(): void { 
        const subscription = this.laolaFileApi.uploadRunning$.subscribe((res) => {
            if(res === true) {
                this.uploaded = true;
            } 
        });
        this.subscriptions.push(subscription);

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }

    receiveFile(event: Event) {
        const target = event.target as HTMLInputElement;
        this.file = target?.files ? target.files[0] : null;
    }


    


    uploadMore() {
        this.uploadForm.reset();
        this.uploaded = false;
        this.laolaFileApi.resetUpload();
    }

    async onSubmit() {
        const uploadDto: IFileUpload = {
            upload: this.file as File, 
            type: this.type,
            filename: this.file?.name || "",
            title: this.uploadForm.get('titleInput')?.value  as string, 
            comment: this.uploadForm.get('commentInput')?.value  as string,
        };

        await this.laolaFileApi.uploadFile(uploadDto);
    }
}
