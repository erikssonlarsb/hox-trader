import { Component } from '@angular/core';
import { Router }  from '@angular/router';

import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  errorMessage: string;


  constructor(private apiService: ApiService, private router: Router) { }

  private register(): void {
    this.errorMessage = null;
    if(this.password == this.confirmPassword) {
      this.apiService.postRegistration(this.name, this.username, this.password, this.email, this.phone)
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          this.errorMessage = error;
        });
    } else {
      this.errorMessage = "Passwords doesn't match"
    }

  }
}
