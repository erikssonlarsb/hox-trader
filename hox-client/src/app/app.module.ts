import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { RoutingModule } from './routing.module';
import { BootstrapModule } from './bootstrap.module';

import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api/api.service';

import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { OverviewComponent } from './routes/overview/overview.component';
import { OrderComponent } from './routes/order/order.component';
import { TransactionsComponent } from './routes/transactions/transactions.component';
import { OrdersComponent } from './routes/orders/orders.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    OverviewComponent,
    OrderComponent,
    TransactionsComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    RoutingModule,
    BootstrapModule
  ],
  providers: [
    AuthService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
