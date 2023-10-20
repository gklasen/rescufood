import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { RecipeInsertionComponent } from './recipe-insertion.component';

const routes: Routes = [
  {
    path: 'recipe_insertion',
    component: RecipeInsertionComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeInsertionRoutingModule {}
