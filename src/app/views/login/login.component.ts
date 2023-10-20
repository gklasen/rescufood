import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = ''; 
  password = '';
  errorMessage=''
  incorrectLogin :boolean = false
  
  private LaolaFileServiceUrl: string = "https://api.laola-projekt.de/api/v1//auth/";
  constructor(private router: Router, private authService:AuthService,
    private http: HttpClient, private translate: TranslateService,) { }
  
  
  login() {
      const formData = { username: this.username, password: this.password };
        this.authService.authenticate(formData.username, formData.password )
        .subscribe(
          (response: any) => {
            console.log('Logged in');
            console.error(response.token);
            localStorage.setItem('token',response.token )
            // Redirect to a protected page or perform other actions
            this.updateTokenOnBackend(response.token);   
          },
          (error) => {
            if (error.status === 403) {
              this.incorrectLogin = true
              this.errorMessage= this.translate.instant('LOGIN.INVALID_LOGIN')
            } else {
              console.error(error);
            }
          }
        );
      
    
  }
  private updateTokenOnBackend(token: string) {
    // Construct the request headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'   
    });
  
    // Make an HTTP request to update the token on the backend
    this.http.get(`${this.LaolaFileServiceUrl}validate-token`, { headers })
      .subscribe(
        (response: any) => {
          console.log('Token updated on the backend', response);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.log('err', error);  
        }
      );
  }
  
  
  
  
}

