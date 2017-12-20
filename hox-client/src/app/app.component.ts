import { Component, Injectable, Injector } from '@angular/core';
import { Http }  from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = this.get();
  constructor(private http: Http, private injector: Injector) {
    console.log("test");
  }

  get(): Promise<any> {
    return this.http
      .get("http://localhost:4000/api/users")
      .toPromise()
      .then(function(response) {
        console.log(response);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
