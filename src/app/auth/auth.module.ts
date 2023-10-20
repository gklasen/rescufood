import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    AuthGuard // Provide the AuthGuard service
  ]
})
export class AuthModule { }
