import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OccurancesComponent } from './occurances.component';

const routes: Routes = [
  {
    path: 'occurances',
    component: OccurancesComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OccurancesRoutingModule {}
