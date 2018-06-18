import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../../services/api/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  invite: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
  success: boolean;
  errorMessage: string;


  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route
      .paramMap
      .subscribe(params => {
        if(params.get('invite')) {  // Retrieve invite from url
          this.invite = params.get('invite');
        }
      });
  }

  register(): void {
    this.errorMessage = null;
    if(this.password != this.confirmPassword) {
      this.errorMessage = "Passwords doesn't match."
    } else {
      this.apiService.postRegistration(this.invite, this.name, this.username, this.password, this.email, this.phone)
        .subscribe(
          () => this.success = true,
          error => this.errorMessage = error.message
        );
    }
  }
}
