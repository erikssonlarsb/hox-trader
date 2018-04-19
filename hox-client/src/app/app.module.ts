import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { DateOnlyModule }  from 'angular-date-only';

import { AppComponent } from './app.component';

import { RoutingModule } from './routing.module';
import { BootstrapModule } from './bootstrap.module';

import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api/api.service';
import { ApiErrorHandler } from './services/api/apierrorhandler.service';

import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { UsersComponent } from './routes/users/users.component';
import { UserDetailsComponent } from './routes/users/details/details.component';
import { InstrumentsComponent } from './routes/instruments/instruments.component';
import { InstrumentDetailsComponent } from './routes/instruments/details/details.component';
import { OrderComponent } from './routes/order/order.component';
import { TransactionsComponent } from './routes/transactions/transactions.component';
import { OrdersComponent } from './routes/orders/orders.component';
import { SettlementsComponent } from './routes/settlements/settlements.component';
import { SettlementDetailsComponent } from './routes/settlements/details/details.component';
import { AdminComponent } from './routes/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UsersComponent,
    UserDetailsComponent,
    InstrumentsComponent,
    InstrumentDetailsComponent,
    OrderComponent,
    TransactionsComponent,
    OrdersComponent,
    SettlementsComponent,
    SettlementDetailsComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    RoutingModule,
    BootstrapModule,
    ChartsModule,
    DateOnlyModule
  ],
  providers: [
    AuthService,
    ApiService,
    ApiErrorHandler


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
