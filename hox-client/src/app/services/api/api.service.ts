import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders }  from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';
import { ApiErrorHandler } from './apierrorhandler.service';

import { User, Instrument, INSTRUMENT_TYPE, Index, Derivative, Order, Trade, OrderDepth, Settlement, Price } from '../../models/index';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService, private errorHandler: ApiErrorHandler) { }

  postRegistration(name: string, username: string, password: string, email: string, phone: string): Observable<{}> {
    let body = {
      name: name,
      username: username,
      password: password,
      email: email,
      phone: phone
    }
    return this.http
      .post(`${window.location.origin}/api/registration`, body)
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getUsers(params: HttpParams = new HttpParams()): Observable<User[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<User[]>(`${window.location.origin}/api/users`, { headers: headers, params: params })
      .map(users => users.map(user => new User(user)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getUser(id: string): Observable<User> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<User>(`${window.location.origin}/api/users/${id}`, { headers: headers })
      .map(user => new User(user))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  updateUser(id: string, user: User): Observable<User> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .put<User>(`${window.location.origin}/api/users/${id}`, user, { headers: headers })
      .map(user => new User(user))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  updateUserPassword(id: string, password: string): Observable<User> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .put<User>(`${window.location.origin}/api/users/${id}`, { password: password }, { headers: headers })
      .map(user => new User(user))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getInstruments(params: HttpParams = new HttpParams()): Observable<Instrument[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Instrument[]>(`${window.location.origin}/api/instruments`, { headers: headers, params: params })
      .map(instruments => instruments.map(instrument => this.instrumentTypeMapper(instrument)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getInstrument(id: string): Observable<Instrument> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Instrument>(`${window.location.origin}/api/instruments/${id}`, { headers: headers })
      .map(instrument => this.instrumentTypeMapper(instrument))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  postInstrument(instrument: Instrument): Observable<Instrument> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .post<Instrument>(`${window.location.origin}/api/instruments`, instrument, { headers: headers })
      .map(instrument => this.instrumentTypeMapper(instrument))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getOrders(params: HttpParams = new HttpParams()): Observable<Order[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Order[]>(`${window.location.origin}/api/orders`, { headers: headers, params: params })
      .map(orders => orders.map(order => new Order(order)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getOrder(id: string): Observable<Order> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Order>(`${window.location.origin}/api/orders/${id}`, { headers: headers })
      .map(order => new Order(order))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  postOrder(order: Order): Observable<Order> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .post<Order>(`${window.location.origin}/api/orders`, order, { headers: headers })
      .map(order => new Order(order))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  deleteOrder(id: string): Observable<{}> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .delete(`${window.location.origin}/api/orders/${id}`, { headers: headers })
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getTrades(params: HttpParams = new HttpParams()): Observable<Trade[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Trade[]>(`${window.location.origin}/api/trades`, { headers: headers, params: params })
      .map(trades => trades.map(trade => new Trade(trade)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getSettlements(params: HttpParams = new HttpParams()): Observable<Settlement[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Settlement[]>(`${window.location.origin}/api/settlements`, { headers: headers, params: params })
      .map(settlements => settlements.map(settlement => new Settlement(settlement)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getSettlement(id: string): Observable<Settlement> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get(`${window.location.origin}/api/settlements/${id}`, { headers: headers })
      .map(settlement => new Settlement(settlement))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  acknowledgeSettlement(id: string): Observable<Settlement> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .put<Settlement>(`${window.location.origin}/api/settlements/${id}`, {isAcknowledged: true}, { headers: headers })
      .map(settlement => new Settlement(settlement))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getOrderDepths(params: HttpParams = new HttpParams()): Observable<OrderDepth[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<OrderDepth[]>(`${window.location.origin}/api/orderdepths`, { headers: headers, params: params })
      .map(orderDepths => orderDepths.map(orderDepth => new OrderDepth(orderDepth)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getOrderDepth(id: string): Observable<OrderDepth> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<OrderDepth>(`${window.location.origin}/api/orderdepths/${id}`, { headers: headers })
      .map(orderDepth => new OrderDepth(orderDepth))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getPrices(params: HttpParams = new HttpParams()): Observable<Price[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Price[]>(`${window.location.origin}/api/prices`, { headers: headers, params: params })
      .map(prices => prices.map(price => new Price(price)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  postPrice(price: Price): Observable<Price> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .post<Price>(`${window.location.origin}/api/prices`, price, { headers: headers })
      .map(price => new Price(price))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getJobs(params: HttpParams = new HttpParams()): Observable<string[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<string[]>(`${window.location.origin}/api/jobs`, { headers: headers, params: params })
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  runJob(id: string): Observable<string> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .put<string>(`${window.location.origin}/api/jobs/${id}/run`, null, { headers: headers })
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  private instrumentTypeMapper(instrument): Instrument {
    switch(instrument.type) {
      case INSTRUMENT_TYPE.Index: {
        return new Index(instrument);
      }
      case INSTRUMENT_TYPE.Derivative: {
        return new Derivative(instrument);
      }
      default: {
        return new Instrument(instrument);
      }
    }
  }
}
