import { Component, OnInit, TemplateRef  } from '@angular/core';
import { Router }  from '@angular/router';
import { trigger,state,style,transition,animate } from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('menuVisibleAnimation', [
        state('hidden', style({
            transform: 'translateY(0)',
        })),
        state('visible', style({
            transform: 'translateY(-100%)',
        })),
        transition('hidden => visible', animate('1000ms ease-in')),
        transition('visible => hidden', animate('1000ms ease-out'))
    ]),
  ]
})
export class AppComponent implements OnInit {
  subscription: Subscription;
  menuVisibleState: string = 'hidden';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.authService.loginChanged
    .subscribe(
      (loggedIn: boolean) => {
        this.toggleNavbarVisible();
      }
    )

    this.authService.init().then(() => {
      if(!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      } else {
        this.toggleNavbarVisible();
      }
    })
  }

  logout(): void {
    this.authService.logout()
      .then(() => {
        window.location.replace('/login');
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  toggleNavbarVisible(): void {
    this.menuVisibleState = (this.menuVisibleState === 'hidden' ? 'visible' : 'hidden');
  }
}
