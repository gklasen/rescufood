import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";


  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService) {
    super();
  }

  logout(){
    console.log('Logged out');    
    localStorage.removeItem('token'); 
  }
}
