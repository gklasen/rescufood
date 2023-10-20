import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, finalize, map, catchError, lastValueFrom } from 'rxjs';
import { ILaolaFileMeta } from 'src/app/models/laola-file-meta.model';
import { IFileUpload } from 'src/app/models/file-upload.model';
import { environment } from '../../../environments/environment';

import { saveAs } from 'file-saver';
import * as mime from 'mime';

@Injectable({
    providedIn: 'root',
})
export class LaolaFileApiService {

    private LaolaFileServiceUrl: string = environment.FSS_API_URL;

    //private LaolaFileServiceUrl: string = 'http://localhost:8000/api/v1/';
    public uploadProgress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public uploadCurrentFiles$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public uploadMaxFiles$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    public uploadRunning$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public courses$: BehaviorSubject<ILaolaFileMeta[]> = new BehaviorSubject<ILaolaFileMeta[]>([]);
    public performances$: BehaviorSubject<ILaolaFileMeta[]> = new BehaviorSubject<ILaolaFileMeta[]>([]);
    public uploadSub: Subscription | null;
    public error$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private FILESIZELIMIT = 50 * 1024 * 1024; 
    private CHUNKSIZE = 25 * 1024 * 1024; 

    constructor(private http: HttpClient) {
        this.uploadSub = null;

        this.fetchFiles('course');
        this.fetchFiles('performance');

    }

    private handleError(err: Error) {
        this.error$.next(true);
    }


    getFileStatistics() {

    }

    async fetchFiles(type: string, searchTerm?: string) {
		
        let searchQuery = searchTerm ? `&search=${searchTerm}` : '';
        const res = await lastValueFrom(this.http.get(`${this.LaolaFileServiceUrl}/files?type=${type}${searchQuery}`));
        if(type === 'course') {
            this.courses$.next(res as ILaolaFileMeta[]);
        } else {
            this.performances$.next(res as ILaolaFileMeta[]);
        }
    }

    fetchFileById(id: string) {
        return this.http.get(`${this.LaolaFileServiceUrl}/files/${id}`);
    }


    uploadFile(fileUpload: IFileUpload) {
        console.error(fileUpload.upload.size);
        console.error(this.FILESIZELIMIT);

        if(fileUpload.upload.size < this.FILESIZELIMIT) {
            this.uploadCompleteFile(fileUpload);
        } else {
            this.uploadChunkedFile(fileUpload); 
        }
    }

    private uploadChunkedFile(fileUpload: IFileUpload) {
        this.uploadRunning$.next(true);
        const chunks = this.createChunks(fileUpload.upload);
        this.uploadChunks(chunks, fileUpload);
        
    }

    private createChunks(file: File){
        let start = 0;
        let result: Blob[] = []; 

        
        while(true) {
            let chunkEnd = Math.min(start + this.CHUNKSIZE , file.size);
            const chunk = file.slice(start, chunkEnd);
            result.push(chunk);

            start = chunkEnd; 
            if(chunkEnd >= file.size) {
                break;
            }
        }
        return result; 

        
    }

    private async uploadChunks(chunks: Blob[], fileUpload: IFileUpload, index: number = 0, sessionId?: string) {
            this.uploadMaxFiles$.next(chunks.length);
            this.uploadCurrentFiles$.next(index + 1);
            this.uploadProgress$.next(0);
            const formData = new FormData();
            formData.append("upload", chunks[index]);
            formData.append("comment", fileUpload.comment);
            formData.append("title", fileUpload.title);
            formData.append("type", fileUpload.type);
            formData.append("mimetype", fileUpload.upload.type);
            formData.append("filename", fileUpload.filename);



            console.error("Start upload of " + index);
            let path = ""; 
            if(index > 0 ) path = `/${sessionId}`
            const upload$ = this.http.post(`${this.LaolaFileServiceUrl}/files/chunk${path}`, formData, {
                reportProgress: true,
                observe: 'events'
            }).pipe(
                finalize(() => {
                    index++; 
                    if(index < chunks.length) {
                        this.uploadChunks(chunks, fileUpload, index, sessionId);
                    } else {
                        this.storeChunks(sessionId as string);

                    }
                }),
                catchError(async (err, caught) => this.handleError(err) ),
            );



            this.uploadSub = upload$.subscribe(value => {
                if(value?.type == HttpEventType.Response) {
                    const response: any = value?.body;
                    if(index === 0) sessionId = response.id;
                }

                if (value?.type == HttpEventType.UploadProgress) {
                    this.uploadProgress$.next(Math.round(100 * (value.loaded / (value.total || 100))));
                }
            })
    }

    private storeChunks(sessionId: string) {
        this.http.post(`${this.LaolaFileServiceUrl}/files/chunk/${sessionId}/store`, null).subscribe({next: (res: any) => {
            this.resetUpload();
        }, error: this.handleError});

    }


    public generateViewPath(fileId: string) {
        const token = localStorage.getItem('token');
		return `${this.LaolaFileServiceUrl}/files/${fileId}/download?token=${token}`; 

    }

    public streamVideo(fileId: any) {
        return `${this.LaolaFileServiceUrl}/files/${fileId}/stream-video`;
    }


    private uploadCompleteFile(fileUpload: IFileUpload) {
        const file: File = fileUpload.upload;
        console.error(fileUpload);
        console.error("Upload");
        console.error(file.size);
        if (file) {
            console.error("Has file ");
            const formData = new FormData();
            formData.append("upload", file);
            formData.append("comment", fileUpload.comment);
            formData.append("title", fileUpload.title);
            formData.append("type", fileUpload.type);
            formData.append("filename", fileUpload.filename);


            const upload$ = this.http.post(`${this.LaolaFileServiceUrl}/files`, formData, {
                reportProgress: true,
                observe: 'events'
            }).pipe(
                catchError(async (err, caught) => this.handleError(err) ),
                finalize(() => this.resetUpload()),
            );

            this.uploadSub = upload$.subscribe(value => {
                this.uploadRunning$.next(true);

                if (value?.type == HttpEventType.UploadProgress) {
                    this.uploadProgress$.next(Math.round( (100 * (value.loaded / (value.total || 100)))));
                }
            })
        }
    }

    async downloadFile(fileMeta: ILaolaFileMeta) {  
        const token = localStorage.getItem('token');

		const downloadUrl = `${this.LaolaFileServiceUrl}/files/${fileMeta.id}/download?token=${token}`; 
		const filename = `${fileMeta.title}` +"."+ mime.getExtension(`${fileMeta.mimetype}`);
	
		saveAs(downloadUrl,filename); 
    }

    async deleteFile(fileMeta: ILaolaFileMeta) { 
		this.http.delete(`${this.LaolaFileServiceUrl}/files/${fileMeta.id}`).subscribe((res: any) => { 
			this.fetchFiles('course');
			this.fetchFiles('performance');
        }); 
    }
	
	async getFile(fileMeta: ILaolaFileMeta) { 
		this.http.get(`${this.LaolaFileServiceUrl}/files/${fileMeta.id}`).subscribe((res: any) => { 
			console.log(res);
        }); 
    }


    public resetUpload() {
        this.uploadProgress$.next(0);
        this.uploadCurrentFiles$.next(0);
        this.uploadMaxFiles$.next(0);


        this.uploadRunning$.next(false);
        this.error$.next(false);

        this.uploadSub?.unsubscribe();
        this.uploadSub = null;
        this.fetchFiles('course');
        this.fetchFiles('performance');

    }

}