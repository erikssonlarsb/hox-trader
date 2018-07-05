import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http }  from '@angular/http';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';
import { WebSocketService, DocumentEvent, DOCUMENT_OPERATION, DOCUMENT_TYPE } from '../../services/websocket/index';

import { Settlement, User } from '../../models/index';

@Component({
  selector: 'app-settlements',
  templateUrl: './settlements.component.html',
  styleUrls: ['./settlements.component.css'],
  providers: [DatePipe]
})

export class SettlementsComponent implements OnInit, OnDestroy  {
  user: User;
  settlements: Array<Settlement>;
  configOptions: any= {
    'hideFinished': {
      value: true,
      caption: "Hide finished",
      explanation: "Hides settlements that has been fully processed."
    }
  };

  constructor(private datePipe: DatePipe, private http: Http, private authService: AuthService, private apiService: ApiService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();

    this.webSocketService.populate('Settlement', ['user', 'counterpartySettlement']);

    this.webSocketService.events.subscribe(
      event => {
        if(event.docType == DOCUMENT_TYPE.Settlement) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Create:
              this.settlements.push(event.document);
              break;
            case DOCUMENT_OPERATION.Update:
              this.settlements.forEach((settlement, i) => {
                if(settlement.id == event.document.id) this.settlements[i] = event.document;
              });
              break;
          }
        }
      }
    );

    this.apiService.getSettlements({'$populate': ['user', 'counterpartySettlement']})
    .subscribe(settlements =>
      this.settlements = settlements.sort((a: Settlement, b: Settlement) => {return a.createTimestamp.getTime() - b.createTimestamp.getTime()})
    );

    // Get config from local storage and replace defaults.
    // Iterate and replace wtih stored settings in order to handle
    // the case when new default settings are added.
    let storedConfig = JSON.parse(localStorage.getItem("settlementsConfig"));
    for (let key in storedConfig) {
      if(this.configOptions[key]) {
        this.configOptions[key] = storedConfig[key];
      }
    }

    // Force ngOnDestroy on page refresh (F5).
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  acknowledgeSettlement(id): void {
    this.apiService.acknowledgeSettlement(id).subscribe();
  }

  openSwish(settlement): void {
    let body = {
      format: "svg",
      payee: {value: settlement.counterpartySettlement.user.phone},
  	  amount: {value: -settlement.amount},
  	  message: {value: settlement.user.name + " " + this.datePipe.transform(settlement.createTimestamp)}
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

  ngOnDestroy(): void {
    // Save config to local storage when component is destroyed.
    localStorage.setItem("settlementsConfig", JSON.stringify(this.configOptions));
  }
}
