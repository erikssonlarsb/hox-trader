import { Component, OnInit } from '@angular/core';
import { Router }  from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  login(): void {
    this.errorMessage = null;
    this.authService.login(this.username, this.password)
      .subscribe(
        () => this.router.navigate(['/']),
        error => this.errorMessage = error.message
      );
  }
}
