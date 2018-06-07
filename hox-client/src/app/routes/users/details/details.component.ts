import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams }  from '@angular/common/http';

import { ApiService } from '../../../services/api/api.service';

import { User, Invite } from '../../../models/index';

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

  invites: Array<Invite>;
  generateInviteStatusMessage: string;
  generateInviteErrorMessage: string;

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
      });

    let intiveParams = new HttpParams({
      fromObject: {
        '_populate': 'invitee'
      }
    });
    this.apiService.getInvites(intiveParams)
      .subscribe(invites => {
        this.invites = invites;
      });
  }

  updateUser(): void {
    this.updateUserStatusMessage = null;  // Reset status message
    this.updateUserErrorMessage = null;  // Reset error message

    this.apiService.updateUser(this.updatedUser.id, this.updatedUser)
      .subscribe(
        user => this.updateUserStatusMessage = "User successfully updated.",
        error => this.updateUserErrorMessage = error.message
      );
  }

  changePassword(): void {
    this.changePasswordStatusMessage = null;  // Reset status message
    this.changePasswordErrorMessage = null;  // Reset error message

    if(this.password == this.confirmPassword) {
      this.apiService.updateUserPassword(this.updatedUser.id, this.password)
        .subscribe(
          user => {
            this.password = null;
            this.confirmPassword = null;
            this.changePasswordStatusMessage = "Password successfully changed."
          },
          error => this.changePasswordErrorMessage = error.message
        );
    } else {
      this.changePasswordErrorMessage = "Passwords doesn't match."
    }
  }

  copyToClipboard(code: string): void {
    const event = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', document.location.origin + '/register/' + code);
      e.preventDefault();
    }
    document.addEventListener('copy', event);
    document.execCommand('copy');
  }

  generateInvite(): void {
    this.generateInviteStatusMessage = null;  // Reset status message
    this.generateInviteErrorMessage = null;  // Reset error message
    this.apiService.postInvite(new Invite({}))
      .subscribe(
        invite => {
          this.invites.push(invite);
          this.generateInviteStatusMessage = "Generated new invite " + invite.code;
        },
        error => this.generateInviteErrorMessage = error.message
      );
  }
}
