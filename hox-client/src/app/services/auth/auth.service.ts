import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, URLSearchParams }  from '@angular/http';

import { Session, User } from '../../models/index';

@Injectable()
export class AuthService {
  private token: string;
  private session: Session;
  private user: User;
  loginChanged = new Subject<boolean>();

  constructor(private http: Http) { }

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

  login(username: string, password: string): Promise<any> {
    let body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
    return this.http
      .post(window.location.origin + "/api/authentication", body)
      .toPromise()
      .then((response) => {
        var token = response.json().token;
        localStorage.setItem('token', token);
        this.token = token;
        this.session = this.getSession(token);
        this.loginChanged.next(true);
        return;
      })
      .catch((error) => {
        return Promise.reject(error.json().message);
      });
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
}
