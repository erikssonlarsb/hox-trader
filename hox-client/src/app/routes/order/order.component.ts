import { Component, OnInit, TemplateRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ApiService } from '../../services/api/index';
import { WebSocketService, DocumentEvent, DOCUMENT_OPERATION, DOCUMENT_TYPE } from '../../services/websocket/index';

import { Instrument, Order, ORDER_SIDE, OrderDepth } from '../../models/index';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent  implements OnInit  {
  instruments: Array<Instrument>;
  instrument: string;
  orderDepth: OrderDepth;
  side: ORDER_SIDE;
  quantity: number;
  price: number;
  order: Order;
  orderUpdates: Array<Order> = [];
  errorMessage: string;

  confirmationModal: BsModalRef;

  constructor(private route: ActivatedRoute, private modalService: BsModalService, private apiService: ApiService, private webSocketService: WebSocketService) { }

  ngOnInit(): void {

    this.webSocketService.populate('OrderDepth', ['instrument']);

    this.webSocketService.events.subscribe(
      event => {
        if(event.docType == DOCUMENT_TYPE.OrderDepth) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Update:
              if(this.orderDepth.instrument.id == event.document.instrument.id) {
                this.orderDepth = event.document;
              }
              break;
          }
        } else if(event.docType == DOCUMENT_TYPE.Order) {
          switch (event.operation) {
            case DOCUMENT_OPERATION.Update:
              if(this.order) {
                if(this.order.id == event.document.id) this.order = event.document;
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
        if(params.get('id')) {  // Retrieve existing order
          this.apiService.getOrder(params.get('id'), {'$populate': 'instrument'})
          .subscribe(order => {
            this.order = order;
            this.instrument = order.instrument.name;
            this.side = order.side;
            this.quantity = order.quantity - order.tradedQuantity;
            this.price = order.price;
          });
        } else if(params.get('instrument')) {  // Populate details from router params
          this.side = ORDER_SIDE[params.get('side')];
          this.quantity = Number(params.get('quantity')) || 0;

          this.apiService.getOrderDepth(params.get('instrument'), {'$populate': 'instrument'})
          .subscribe(orderDepth => {
            this.orderDepth = orderDepth;
            this.instrument = orderDepth.instrument.name;
            this.instruments = [orderDepth.instrument];

            if(params.get('price')) {
              this.price = Number(params.get('price')) || 0;
            } else if (this.orderDepth.levels[0]) {
               if (this.side == ORDER_SIDE.BUY) {
                 this.price = this.orderDepth.levels[0].sellPrice || 0;
               } else {
                 this.price = this.orderDepth.levels[0].buyPrice || 0;
               }
            } else {
              this.price = 0;
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

  //TODO: Should work by model binding
  onSideChange(side): void {
    this.side = side;
  }

  placeOrder(): void {
    this.errorMessage = null;  // Reset error message

    //TODO: Should be form validation on required fields.
    if(!this.instrument) {
      this.errorMessage = "No instrument selected";
      return;
    }
    let instrument = this.instruments.find(instrument => instrument.name == this.instrument);
    let newOrder = new Order({instrument: instrument, side: this.side, quantity: this.quantity, price: this.price});
    this.apiService.postOrder(newOrder)
    .subscribe(
      createdOrder => {
        if(this.orderUpdates.length == 0) {
          this.order = createdOrder;
        } else {
          let latestOrderUpdate = this.orderUpdates.find(orderUpdate => orderUpdate.id == createdOrder.id);
          this.orderUpdates = [];
          if(latestOrderUpdate && latestOrderUpdate.updateTimestamp > createdOrder.updateTimestamp) {
            this.order = latestOrderUpdate;
          } else {
            this.order = createdOrder;
          }
        }

      },
      error => this.errorMessage = error.message
    );
    this.confirmationModal.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.confirmationModal = this.modalService.show(template);
  }
}
