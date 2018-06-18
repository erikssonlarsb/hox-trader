import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders }  from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../../services/auth/auth.service';
import { ApiParams } from './apiparams';
import { ApiErrorHandler } from './apierrorhandler.service';

import { Invite, User, Instrument, INSTRUMENT_TYPE, Index, Derivative, Order, Trade, Ticker, OrderDepth, Settlement, Price } from '../../models/index';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient, private authService: AuthService, private errorHandler: ApiErrorHandler) { }

  postRegistration(invite: string, name: string, username: string, password: string, email: string, phone: string): Observable<void> {
    let body = {
      invite: invite,
      name: name,
      username: username,
      password: password,
      email: email,
      phone: phone
    }
    return this.http
      .post<void>(`${window.location.origin}/api/registration`, body)
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getInvites(params: ApiParams | Object = {}): Observable<Invite[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Invite[]>(`${window.location.origin}/api/invites`, { headers: headers, params: this.toHttpParams(params) })
      .map(invites => invites.map(invite => new Invite(invite)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  postInvite(invite: Invite): Observable<Invite> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .post<Invite>(`${window.location.origin}/api/invites`, invite, { headers: headers })
      .map(invite => new Invite(invite))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getUsers(params: ApiParams | Object = {}): Observable<User[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<User[]>(`${window.location.origin}/api/users`, { headers: headers, params: this.toHttpParams(params) })
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

  getInstruments(params: ApiParams | Object = {}): Observable<Instrument[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Instrument[]>(`${window.location.origin}/api/instruments`, { headers: headers, params: this.toHttpParams(params) })
      .map(instruments => instruments.map(instrument => Instrument.typeMapper(instrument)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getInstrument(id: string, params: ApiParams | Object = {}): Observable<Instrument> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Instrument>(`${window.location.origin}/api/instruments/${id}`, { headers: headers, params: this.toHttpParams(params) })
      .map(instrument => Instrument.typeMapper(instrument))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  postInstrument(instrument: Instrument): Observable<Instrument> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .post<Instrument>(`${window.location.origin}/api/instruments`, instrument, { headers: headers })
      .map(instrument => Instrument.typeMapper(instrument))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  updateInstrument(id: string, instrument: Instrument): Observable<Instrument> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .put<Instrument>(`${window.location.origin}/api/instruments/${id}`, instrument, { headers: headers })
      .map(instrument => Instrument.typeMapper(instrument))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getOrders(params: ApiParams | Object = {}): Observable<Order[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Order[]>(`${window.location.origin}/api/orders`, { headers: headers, params: this.toHttpParams(params) })
      .map(orders => orders.map(order => new Order(order)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getOrder(id: string, params: ApiParams | Object = {}): Observable<Order> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Order>(`${window.location.origin}/api/orders/${id}`, { headers: headers, params: this.toHttpParams(params) })
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

  withdrawOrder(id: string): Observable<{}> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .delete(`${window.location.origin}/api/orders/${id}`, { headers: headers })
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getTrades(params: ApiParams | Object = {}): Observable<Trade[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Trade[]>(`${window.location.origin}/api/trades`, { headers: headers, params: this.toHttpParams(params) })
      .map(trades => trades.map(trade => new Trade(trade)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getTickers(params: ApiParams | Object = {}): Observable<Ticker[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Ticker[]>(`${window.location.origin}/api/tickers`, { headers: headers, params: this.toHttpParams(params) })
      .map(tickers => tickers.map(ticker => new Ticker(ticker)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getSettlements(params: ApiParams | Object = {}): Observable<Settlement[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Settlement[]>(`${window.location.origin}/api/settlements`, { headers: headers, params: this.toHttpParams(params) })
      .map(settlements => settlements.map(settlement => new Settlement(settlement)))
      .pipe(
        catchError(error => this.errorHandler.handleError(error))
      );
  }

  getSettlement(id: string, params: ApiParams | Object = {}): Observable<Settlement> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get(`${window.location.origin}/api/settlements/${id}`, { headers: headers, params: this.toHttpParams(params) })
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

  getOrderDepths(params: ApiParams | Object = {}): Observable<OrderDepth[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<OrderDepth[]>(`${window.location.origin}/api/orderdepths`, { headers: headers, params: this.toHttpParams(params) })
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

  getPrices(params: ApiParams | Object = {}): Observable<Price[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<Price[]>(`${window.location.origin}/api/prices`, { headers: headers, params: this.toHttpParams(params) })
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

  getJobs(params: ApiParams | Object = {}): Observable<string[]> {
    let headers = new HttpHeaders({'Authorization': 'Bearer ' + this.authService.getToken()});
    return this.http
      .get<string[]>(`${window.location.origin}/api/jobs`, { headers: headers, params: this.toHttpParams(params) })
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

  private toHttpParams(params: ApiParams | Object): HttpParams {
    if(params instanceof ApiParams ) {
      return params.toHttpParams();
    } else {
      return new ApiParams(params).toHttpParams();
    }
  }
}
