import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http }  from '@angular/http';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { Settlement } from '../../models/index';
import { User } from '../../services/auth/payload';

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.component.html',
  styleUrls: ['./settlements.component.css'],
  providers: [DatePipe]
})

export class SettlementsComponent implements OnInit  {
  user: User;
  settlements: Array<Settlement>;

  constructor(private datePipe: DatePipe, private http: Http, private authService: AuthService, private ApiService: ApiService) { }

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

  openSwish(settlement): void {
    let body = {
      format: "svg",
      payee: {value: settlement.counterpartySettlement.user.phone},
  	  amount: {value: -settlement.amount},
  	  message: {value: settlement.user.name + " " + this.datePipe.transform(settlement.updateTimestamp)}
    }

    var wnd = window.open("", "_blank", "width=500, height=500");
    this.http
      .post(`${window.location.origin}/qr`, body)
      .toPromise()
      .then(function(response) {
        wnd.document.write(response.text());
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}
