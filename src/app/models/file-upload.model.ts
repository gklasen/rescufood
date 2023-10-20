
export interface IFileUpload {
    title: string; 
    type: string;
    mimetype?: string;
    comment: string;  
    upload: File;
    filename: string;
}