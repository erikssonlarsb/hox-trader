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

  constructor(private authService: AuthService, private router: Router) { }

  private login(): void {
    this.authService.login(this.username, this.password)
      .then(() => {
        this.router.navigate(['/overview']);
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
