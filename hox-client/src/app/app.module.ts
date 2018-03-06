import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';

import { RoutingModule } from './routing.module';
import { BootstrapModule } from './bootstrap.module';

import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api/api.service';

import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { InstrumentsComponent } from './routes/instruments/instruments.component';
import { InstrumentDetailsComponent } from './routes/instruments/details/details.component';
import { OrderComponent } from './routes/order/order.component';
import { TransactionsComponent } from './routes/transactions/transactions.component';
import { OrdersComponent } from './routes/orders/orders.component';
import { SettlementsComponent } from './routes/settlements/settlements.component';
import { SettlementDetailsComponent } from './routes/settlements/details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    InstrumentsComponent,
    InstrumentDetailsComponent,
    OrderComponent,
    TransactionsComponent,
    OrdersComponent,
    SettlementsComponent,
    SettlementDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    RoutingModule,
    BootstrapModule,
    ChartsModule
  ],
  providers: [
    AuthService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
