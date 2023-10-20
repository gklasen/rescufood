import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  HttpRequest, HttpHandler,  HttpInterceptor } from '@angular/common/http';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // cloned headers, updated with the authorization.
    console.error("IMA HTTP INTERCEPTOR");
    const token = localStorage.getItem('token');

    let authReq;
    if (token) {
        authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
    } else { 
        authReq = req;
    }

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}