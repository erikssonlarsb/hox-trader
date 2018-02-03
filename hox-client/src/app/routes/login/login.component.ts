import { Component } from '@angular/core';
import { Router }  from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) { }

  private login(): void {
    this.errorMessage = null;
    this.authService.login(this.username, this.password)
      .then(() => {
        this.router.navigate(['/overview']);
      })
      .catch((error) => {
        this.errorMessage = error;
      });
  }
}
