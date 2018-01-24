import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions }  from '@angular/http';

import { AuthService } from '../../services/auth/auth.service';

import { Instrument, Order, ORDER_SIDE, Trade, OrderDepth } from '../../models/index';

@Injectable()
export class ApiService {

  constructor(private http: Http, private authService: AuthService) { }

  getInstruments(params: URLSearchParams = new URLSearchParams()): Promise<Instrument[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/instruments`, options)
      .toPromise()
      .then(response => response.json().map(json => new Instrument(json)))
      .catch(this.handleError);
  }

  getInstrument(id: string): Promise<Instrument> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .get(`${window.location.origin}/api/instruments/${id}`, options)
      .toPromise()
      .then(response => new Instrument(response.json()))
      .catch(this.handleError);
  }

  getOrders(params: URLSearchParams = new URLSearchParams()): Promise<Order[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/orders`, options)
      .toPromise()
      .then(response => response.json().map(json => new Order(json)))
      .catch(this.handleError);
  }

  postOrder(instrument: string, side: ORDER_SIDE, quantity: number, price: number): Promise<Order> {
    let body = {
      instrument: instrument,
      side: side,
      quantity: quantity,
      price: price
    }

    console.log(body);
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .post(`${window.location.origin}/api/orders`, body, options)
      .toPromise()
      .then(response => new Order(response.json()))
      .catch(this.handleError);
  }

  getTrades(params: URLSearchParams = new URLSearchParams()): Promise<Trade[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/trades`, options)
      .toPromise()
      .then(response => response.json().map(json => new Trade(json)))
      .catch(this.handleError);
  }

  getOrderDepths(params: URLSearchParams = new URLSearchParams()): Promise<OrderDepth[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/orderdepths`, options)
      .toPromise()
      .then(response => response.json().map(json => new OrderDepth(json)))
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
