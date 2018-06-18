import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService, ApiParams } from '../../services/api/index';

import { Order, User } from '../../models/index';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit, OnDestroy  {
  user: User;
  orders: Array<Order>;

  orderToWithdraw: Order;
  withdrawModal: BsModalRef;

  configOptions: any = {
    'hideExpiredInstruments': {
      value: true,
      caption: "Hide expired instruments",
      explanation: "Hides orders in expired instruments."
    },
    'hideNonActiveOrders': {
      value: true,
      caption: "Hide non-active orders",
      explanation: "Hides orders that are not in state Active."
    }
  };

  constructor(private modalService: BsModalService, private authService: AuthService, private ApiService: ApiService) { }

  ngOnInit(): void {
    this.user = this.authService.getLoggedInUser();

    let orderParams = new ApiParams({
        '$populate': [
          'user',
          {
            path: 'instrument',
            populate: {
              path: 'underlying'
            }
        }]
    });
    this.ApiService.getOrders(orderParams)
    .subscribe(
      orders => this.orders = orders.sort((a: Order, b: Order) => {return a.createTimestamp.getTime() - b.createTimestamp.getTime()})
    );

    // Get config from local storage and replace defaults.
    // Iterate and replace wtih stored settings in order to handle
    // the case when new default settings are added.
    let storedConfig = JSON.parse(localStorage.getItem("ordersConfig"));
    for (let key in storedConfig) {
      if(this.configOptions[key]) {
        this.configOptions[key] = storedConfig[key];
      }
    }

    // Force ngOnDestroy on page refresh (F5).
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  withdrawOrder(id): void {
    let orderParams = new ApiParams({
        '$populate': [
          'user',
          {
            path: 'instrument',
            populate: {
              path: 'underlying'
            }
        }]
    });
    this.ApiService.withdrawOrder(id)
    .subscribe(() => {
      this.ApiService.getOrders(orderParams)
      .subscribe(
        orders => this.orders = orders
      );
      this.orderToWithdraw = null;
      this.withdrawModal.hide();
    });
  }

  openWithdrawModal(template: TemplateRef<any>, order: Order) {
    this.orderToWithdraw = order;
    this.withdrawModal = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    // Save config to local storage when component is destroyed.
    localStorage.setItem("ordersConfig", JSON.stringify(this.configOptions));
  }
}
