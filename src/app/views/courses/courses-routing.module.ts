import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VideosModule } from './videos/videos.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: `Courses`
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'videos'
      },
      {
        path: 'videos',
        loadChildren: () => VideosModule,
        data: {
          title: 'Videos'
        }
      },
      {
        path: 'file-upload',
        component:  FileUploadComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Upload'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule {
}
