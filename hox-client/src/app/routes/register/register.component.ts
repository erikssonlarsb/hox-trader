import { Component } from '@angular/core';

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
  success: boolean;
  errorMessage: string;


  constructor(private apiService: ApiService) { }

  register(): void {
    this.errorMessage = null;
    if(this.password == this.confirmPassword) {
      this.apiService.postRegistration(this.name, this.username, this.password, this.email, this.phone)
        .subscribe(
          () => this.success = true
        );
    } else {
      this.errorMessage = "Passwords doesn't match."
    }
  }
}
