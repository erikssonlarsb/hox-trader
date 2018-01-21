import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "HOX Trader";

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.init().then(() => {
      if(!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
    })
  }
}
