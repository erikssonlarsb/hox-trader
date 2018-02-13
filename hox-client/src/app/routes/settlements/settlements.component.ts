import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { Settlement } from '../../models/index';
import { User } from '../../services/auth/payload';

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.component.html',
  styleUrls: ['./settlements.component.css']
})

export class SettlementsComponent implements OnInit  {
  user: User;
  settlements: Array<Settlement>;

  constructor(private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.ApiService.getSettlements()
      .then((settlements) => {
        this.settlements = settlements;
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  acknowledgeSettlement(id): void {
    this.ApiService.acknowledgeSettlement(id)
      .then(() => {
        this.ApiService.getSettlements()
          .then((settlements) => {
            this.settlements = settlements;
          })
          .catch(function(err) {
            console.log(err);
          });
      }).catch(function(err) {
        console.log(err);
      });
  }

  openSwish(id): void {
    window.open("swish://paymentrequest?token=12345&callbackurl=localhost", "_blank");
  }
}
