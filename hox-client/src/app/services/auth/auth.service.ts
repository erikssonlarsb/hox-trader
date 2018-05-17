import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders }  from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse }  from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { Session, User } from '../../models/index';

@Injectable()
export class AuthService {
  private token: string;
  private session: Session;
  private user: User;
  loginChanged = new Subject<boolean>();

  constructor(private http: HttpClient) { }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
      if(this.token) {
        this.session = this.getSession(this.token);
      }
      this.loginChanged.next(this.isAuthenticated());
      resolve();
    });
  }

  isAuthenticated(): boolean {
    if (this.session && this.session.isValid()) {
      return true;
    } else {
      this.token = null;
      this.session = null;
      this.user = null;
      localStorage.removeItem('token');
      return false;
    }
  }

  login(username: string, password: string): Observable<void> {
    let headers = new HttpHeaders({'Authorization': 'Basic ' + btoa(username + ':' + password)});
    return this.http
      .get<any>(`${window.location.origin}/api/token`, { headers: headers })
      .map(response => {
        var token = response.token;
        localStorage.setItem('token', token);
        this.token = token;
        this.session = this.getSession(token);
        this.loginChanged.next(true);
      })
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  logout(): Promise<void> {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('token');
      this.loginChanged.next(false);
      window.location.replace('/login');
      resolve();
    });
  }

  getLoggedInUser(): User {
    if(this.isAuthenticated()) {
      return this.session.user;
    } else {
      return null;
    }
  }

  getToken(): string {
    if(this.isAuthenticated()) {
      return this.token;
    } else {
      return null;
    }
  }

  private getSession(token: string): Session {
    var base64Url = token.split('.')[1];
    if(!base64Url) {return null;}  // token is corrupt
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var json = JSON.parse(window.atob(base64));
    return new Session(json);;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned status ${error.status}, ` +
        `with message: ${error.error.message} ` +
        `and code: ${error.error.code}`
      );
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(error.error);
  };
}
