import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecipeDraftsComponent } from './recipe-drafts.component';

const routes: Routes = [
  {
    path: 'recipe_drafts',
    component: RecipeDraftsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeDraftsRoutingModule {}
