import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');

    if (token) {
      // Token exists; now, validate it on the backend
      return this.authService.validateToken().pipe(
        map((response: any) => {
          console.error("IS VALID " );
          console.error(response);
          // Token is valid; allow access to the route
          return true;
        }),
        catchError((error) => {
          // Token is invalid or expired; redirect to the login page
          console.error('Token validation failed:', error);
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      // Token is missing; redirect to the login page
      console.error("TOKEN IS MISSING");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
