import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions }  from '@angular/http';

import { AuthService } from '../../services/auth/auth.service';

import { Instrument, INSTRUMENT_TYPE, Order, ORDER_SIDE, Trade, OrderDepth, Settlement, Price, PRICE_TYPE } from '../../models/index';

@Injectable()
export class ApiService {

  constructor(private http: Http, private authService: AuthService) { }

  postRegistration(name: string, username: string, password: string, email: string, phone: string): Promise<any> {
    let body = {
      name: name,
      username: username,
      password: password,
      email: email,
      phone: phone
    }
    return this.http
      .post(`${window.location.origin}/api/registration`, body)
      .toPromise()
      .then(response => response)
      .catch(error => this.handleError(error, this.authService));
  }

  getInstruments(params: URLSearchParams = new URLSearchParams()): Promise<Instrument[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/instruments`, options)
      .toPromise()
      .then(response => response.json().map(json => new Instrument(json)))
      .catch(error => this.handleError(error, this.authService));
  }

  getInstrument(id: string): Promise<Instrument> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .get(`${window.location.origin}/api/instruments/${id}`, options)
      .toPromise()
      .then(response => new Instrument(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  postInstrument(name: string, type: INSTRUMENT_TYPE, underlying: string, expiry: Date): Promise<Instrument> {
    let body = {
      name: name,
      type: type,
      underlying: underlying,
      expiry: expiry
    }
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .post(`${window.location.origin}/api/instruments`, body, options)
      .toPromise()
      .then(response => new Instrument(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  getOrders(params: URLSearchParams = new URLSearchParams()): Promise<Order[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/orders`, options)
      .toPromise()
      .then(response => response.json().map(json => new Order(json)))
      .catch(error => this.handleError(error, this.authService));
  }

  getOrder(id: string): Promise<Order> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .get(`${window.location.origin}/api/orders/${id}`, options)
      .toPromise()
      .then(response => new Order(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  postOrder(instrument: string, side: ORDER_SIDE, quantity: number, price: number): Promise<Order> {
    let body = {
      instrument: instrument,
      side: side,
      quantity: quantity,
      price: price
    }
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .post(`${window.location.origin}/api/orders`, body, options)
      .toPromise()
      .then(response => new Order(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  deleteOrder(id: string): Promise<any> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .delete(`${window.location.origin}/api/orders/${id}`, options)
      .toPromise()
      .then(response => response.json())
      .catch(error => this.handleError(error, this.authService));
  }

  getTrades(params: URLSearchParams = new URLSearchParams()): Promise<Trade[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/trades`, options)
      .toPromise()
      .then(response => response.json().map(json => new Trade(json)))
      .catch(error => this.handleError(error, this.authService));
  }

  getSettlements(params: URLSearchParams = new URLSearchParams()): Promise<Settlement[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/settlements`, options)
      .toPromise()
      .then(response => response.json().map(json => new Settlement(json)))
      .catch(error => this.handleError(error, this.authService));
  }

  getSettlement(id: string): Promise<Settlement> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .get(`${window.location.origin}/api/settlements/${id}`, options)
      .toPromise()
      .then(response => new Settlement(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  acknowledgeSettlement(id: string): Promise<Settlement> {
    let body = {
      isAcknowledged: true
    }
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .put(`${window.location.origin}/api/settlements/${id}`, body, options)
      .toPromise()
      .then(response => new Settlement(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  getOrderDepths(params: URLSearchParams = new URLSearchParams()): Promise<OrderDepth[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/orderdepths`, options)
      .toPromise()
      .then(response => response.json().map(json => new OrderDepth(json)))
      .catch(error => this.handleError(error, this.authService));
  }

  getOrderDepth(id: string): Promise<OrderDepth> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .get(`${window.location.origin}/api/orderdepths/${id}`, options)
      .toPromise()
      .then(response => new OrderDepth(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  getPrices(params: URLSearchParams = new URLSearchParams()): Promise<Price[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/prices`, options)
      .toPromise()
      .then(response => response.json().map(json => new Price(json)))
      .catch(error => this.handleError(error, this.authService));
  }

  postPrice(instrument: string, type: PRICE_TYPE, date: Date, value: number): Promise<Price> {
    let body = {
      instrument: instrument,
      type: type,
      date: date,
      value: value
    }
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .post(`${window.location.origin}/api/prices`, body, options)
      .toPromise()
      .then(response => new Price(response.json()))
      .catch(error => this.handleError(error, this.authService));
  }

  getJobs(params: URLSearchParams = new URLSearchParams()): Promise<string[]> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(`${window.location.origin}/api/jobs`, options)
      .toPromise()
      .then(response => response.json().map(json => json))
      .catch(error => this.handleError(error, this.authService));
  }

  runJob(id: string): Promise<string> {
    let headers = new Headers({'Authorization': 'Bearer ' + this.authService.getToken()});
    let options = new RequestOptions({ headers: headers});
    return this.http
      .put(`${window.location.origin}/api/jobs/${id}/run`, null, options)
      .toPromise()
      .then(response => response)
      .catch(error => this.handleError(error, this.authService));
  }

  private handleError(error: any, authService: AuthService): Promise<any> {
    console.log(error);
    if(error.status == 401) {
      authService.logout();
    } else {
      let json = error.json();
      if(!json) {
        return Promise.reject(error.statusText + ": " + error.status);
      } else if(json.error && json.error.errmsg) {
        return Promise.reject(json.error.errmsg);
      } else if(json.error) {
        return Promise.reject(json.error);
      } else if(json.message) {
        return Promise.reject(json.message);
      } else {
        return Promise.reject("Unknown error.");
      }
    }
  }
}
