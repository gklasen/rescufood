import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PerformancesVideosModule } from './videos/performances-videos.module';
const routes: Routes = [
  {
    path: '',
    data: {
      title: `Performances`
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'videos'
      },
      {
        path: 'videos',
        loadChildren: () => PerformancesVideosModule,
        data: {
          title: 'Videos'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformancesRoutingModule {
}
