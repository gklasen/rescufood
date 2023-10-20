import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { SharedModule } from '../../shared/shared.module';
import { IconModule } from '@coreui/icons-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,
    FormsModule,
    SharedModule,
  ]
})
export class LoginModule { }
