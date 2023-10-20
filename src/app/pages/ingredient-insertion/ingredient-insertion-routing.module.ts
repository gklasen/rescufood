import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IngredientInsertionComponent } from './ingredient-insertion.component';

const routes: Routes = [
  {
    path: 'ingredient_insertion',
    component: IngredientInsertionComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientInsertionRoutingModule {}
