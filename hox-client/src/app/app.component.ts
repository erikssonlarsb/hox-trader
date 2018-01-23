import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  subscription: Subscription;
  loggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {

    this.subscription = this.authService.loginChanged
    .subscribe(
      (loggedIn: boolean) => {
        this.loggedIn = loggedIn;
      }
    )

    this.authService.init().then(() => {
      if(!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    })
  }

  logout(): void {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
