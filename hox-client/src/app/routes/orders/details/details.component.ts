import { Component, OnInit, TemplateRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ApiService } from '../../../services/api/index';
import { WebSocketService, DocumentEvent, DOCUMENT_OPERATION, DOCUMENT_TYPE } from '../../../services/websocket/index';

import { Instrument, Order, ORDER_SIDE, OrderDepth } from '../../../models/index';

@Component({
  selector: 'app-order',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class OrderDetailsComponent  implements OnInit  {
  instruments: Array<Instrument>;
  instrument: Instrument;
  instrumentVal: string;
  orderDepth: OrderDepth;
  order: Order;
  orderUpdates: Array<Order> = [];
  errorMessage: string;

  confirmationModal: BsModalRef;

  constructor(private router: Router, private route: ActivatedRoute, private modalService: BsModalService, private apiService: ApiService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    }

    this.webSocketService.events.subscribe(
      event => {
        if(event.docType == DOCUMENT_TYPE.Instrument && this.instrument && event.document.id == this.instrument.id) {
          switch(event.operation) {
            case DOCUMENT_OPERATION.Update:
              this.instrument = event.document;
          }
        } else if(event.docType == DOCUMENT_TYPE.OrderDepth && this.instrument && event.document.instrument.id == this.instrument.id) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Update:
              this.orderDepth = event.document;
              break;
          }
        } else if(event.docType == DOCUMENT_TYPE.Order) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Update:
              if(this.order.id) {  // Order has id if it's been returned from server
                if(this.order.id == event.document.id) {
                  this.order = event.document;
                }
              } else {
                this.orderUpdates.unshift(event.document);
              }
              break;
          }
        }
      }
    );

    this.route
      .paramMap
      .subscribe(params => {
        if(params.get('id') != 'new') {  // Retrieve existing order
          this.apiService.getOrder(params.get('id'), {'$populate': 'instrument'})
          .subscribe(order => {
            this.order = order;
            this.instrument = order.instrument;
            this.instrumentVal = order.instrument.name;
            this.apiService.getOrderDepth(this.instrument.id)
            .subscribe(orderDepth => {
              this.orderDepth = orderDepth;
            });
          });
        } else if(params.get('instrument')) {  // Populate details from router params
          this.apiService.getOrderDepth(params.get('instrument'), {'$populate': 'instrument'})
          .subscribe(orderDepth => {
            this.orderDepth = orderDepth;
            this.instrument = orderDepth.instrument;
            this.instrumentVal = orderDepth.instrument.name;

            this.order = new Order({instrument: this.instrument});
            this.order.side = ORDER_SIDE[params.get('side')];
            this.order.quantity = Number(params.get('quantity')) || 0;

            if(params.get('price')) {
              this.order.price = Number(params.get('price')) || 0;
            } else if (this.orderDepth.levels[0]) {
               if (this.order.side == ORDER_SIDE.BUY) {
                 this.order.price = this.orderDepth.levels[0].sellPrice || 0;
               } else {
                 this.order.price = this.orderDepth.levels[0].buyPrice || 0;
               }
            } else {
              this.order.price = 0;
            }
          });
        } else {  // Get all instruments for client to fill in order details
          this.apiService.getInstruments()
          .subscribe(
            instruments => this.instruments = instruments
          );
        }
      });
  }

  setOrderQuantity(remainingQuantity: string) {
    this.order.quantity = parseInt(remainingQuantity) + (this.order.tradedQuantity || 0);
  }

  createOrder(): void {
    this.errorMessage = null;  // Reset error message

    //TODO: Should be form validation on required fields.
    if(!this.instrument) {
      this.errorMessage = "No instrument selected";
      return;
    }
    this.apiService.postOrder(this.order)
    .subscribe(
      order => {
        if(this.orderUpdates.length == 0) {
          this.order = order;
        } else {
          let latestOrderUpdate = this.orderUpdates.find(orderUpdate => orderUpdate.id == order.id);
          this.orderUpdates = [];  // Reset queue
          if(latestOrderUpdate && latestOrderUpdate.updateTimestamp > order.updateTimestamp) {
            this.order = latestOrderUpdate;
          } else {
            this.order = order;
          }
        }

      },
      error => this.errorMessage = error.message
    );
    this.confirmationModal.hide();
}

  modifyOrder(): void {
    this.errorMessage = null;  // Reset error message
    this.apiService.updateOrder(this.order.id, this.order)
    .subscribe(
      order => {
        this.order = order;
      },
      error => this.errorMessage = error.message
    );
    this.confirmationModal.hide();
  }

  withdrawOrder(): void {
    this.errorMessage = null;  // Reset error message
    this.apiService.withdrawOrder(this.order.id)
    .subscribe(
      () => {this.order.status == 'WITHDRAWN'},
      error => this.errorMessage = error.message
    );
    this.confirmationModal.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.confirmationModal = this.modalService.show(template);
  }
}
