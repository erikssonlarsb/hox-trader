import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../../../services/api/api.service';

import { User } from '../../../models/index';

@Component({
  selector: 'app-user-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class UserDetailsComponent implements OnInit  {
  originalUser: User;
  updatedUser: User;
  updateUserStatusMessage: string;
  updateUserErrorMessage: string;

  password: string;
  confirmPassword: string;
  changePasswordStatusMessage: string;
  changePasswordErrorMessage: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route
    .paramMap
    .subscribe(params => {
      if(params.get('id')) {  // Retrieve existing order
        this.apiService.getUser(params.get('id'))
          .subscribe(user => {
            this.originalUser = Object.assign({}, user);
            this.updatedUser = Object.assign({}, user);
          });
        }
      }
    )
  }

  updateUser(): void {
    this.updateUserStatusMessage = null;  // Reset status message
    this.updateUserErrorMessage = null;  // Reset error message

    this.apiService.updateUser(this.updatedUser.id, this.updatedUser)
      .subscribe(
        user => this.updateUserStatusMessage = "User successfully updated."
      );
  }

  changePassword(): void {
    this.changePasswordStatusMessage = null;  // Reset status message
    this.changePasswordErrorMessage = null;  // Reset error message

    if(this.password == this.confirmPassword) {
      this.apiService.updateUserPassword(this.updatedUser.id, this.password)
        .subscribe(user => {
          this.password = null;
          this.confirmPassword = null;
          this.changePasswordStatusMessage = "Password successfully changed."
        });
    } else {
      this.changePasswordErrorMessage = "Passwords doesn't match."
    }
  }
}
