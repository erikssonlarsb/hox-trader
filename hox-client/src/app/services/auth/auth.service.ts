import { Injectable } from '@angular/core';
import { Http, URLSearchParams }  from '@angular/http';

import { Payload } from './payload';

@Injectable()
export class AuthService {
  private token: string;
  private payload: Payload;
  constructor(private http: Http) { }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.token = localStorage.getItem('token');
      if(this.token) {
        this.payload = this.getPayload(this.token);
        this.isAuthenticated();
      }
      resolve();
    })
  }

  isAuthenticated(): boolean {
    if (this.payload && this.payload.isValid()) {
      return true;
    } else {
      this.token = null;
      this.payload = null;
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
          this.payload = this.getPayload(token);
          return;
        })
        .catch(function(err) {
          throw err.json();
        });
  }

  private getPayload(token: string): Payload {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    var json = JSON.parse(window.atob(base64));
    let payload : Payload = Object.assign(new Payload(), json);
    return payload;
  }
}
