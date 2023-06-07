import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FbAuthResponse, User } from 'src/app/shared/interfaces';
import { Observable, Subject, catchError, map, pipe, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn:'root'})
export class AuthService {
  public error$: Subject <string> = new Subject <string>()
  
  constructor(private http: HttpClient) {}

  get token(): any {
    const token = localStorage.getItem('fb-token');
    const expDateString = localStorage.getItem('fb-token-exp');

    if (!token || !expDateString) {
      return null;
    }

    const expDate = new Date(expDateString);
    if (new Date() > expDate) {
      this.logout();
      return null;
    }

    return token;
  }

  login(user: User): Observable<any> {
    user.returnSecureToken = true;
    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(
        map((response) => {
          this.setToken(response);
          return response;
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error

    switch(message){
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email');
        break

      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password');
        break

      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email not found');
        break
    }

    return throwError(error)
  }

  private setToken(response: any | FbAuthResponse) {
    if (response) {
      const expDate = new Date(
        new Date().getTime() + +response.expiresIn * 1000
      );
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
