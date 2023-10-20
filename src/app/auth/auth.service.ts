import { Injectable } from '@angular/core';
import { apiKey } from './auth.config'; // Import the API key
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LaolaFileServiceUrl: string = environment.FSS_API_URL;
  
  constructor(private http: HttpClient) { }
  authenticate(username: string, password: string, customHeaders?: HttpHeaders): Observable<any> {

    const loginUrl = `${this.LaolaFileServiceUrl}auth/login`;
    const credentials = { username, password };

    return this.http.post(loginUrl, credentials);
  } 

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Check if token exists (truthy)
  }

  validateToken(): Observable<any> {
    return this.http.get(`${this.LaolaFileServiceUrl}auth/validate-token`);
  }

}
