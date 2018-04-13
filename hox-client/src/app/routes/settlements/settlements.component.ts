import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http }  from '@angular/http';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { Settlement, User } from '../../models/index';

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.component.html',
  styleUrls: ['./settlements.component.css'],
  providers: [DatePipe]
})

export class SettlementsComponent implements OnInit  {
  user: User;
  settlements: Array<Settlement>;
  hideFinished: boolean = true;

  constructor(private datePipe: DatePipe, private http: Http, private authService: AuthService, private apiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();
    this.apiService.getSettlements()
      .subscribe(settlements =>
        this.settlements = settlements.sort((a: Settlement, b: Settlement) => {return a.createTimestamp.getTime() - b.createTimestamp.getTime()})
      );
  }

  acknowledgeSettlement(id): void {
    this.apiService.acknowledgeSettlement(id)
      .subscribe(() => {
        this.apiService.getSettlements()
          .subscribe(settlements => {
            this.settlements = settlements.sort((a: Settlement, b: Settlement) => {return a.createTimestamp.getTime() - b.createTimestamp.getTime()})
          });
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
