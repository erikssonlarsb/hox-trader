import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { InformationComponent } from './routes/information/information.component';
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

const routes: Routes = [
  { path: '', redirectTo: '/instruments', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'information', component: InformationComponent },
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'instruments', component: InstrumentsComponent },
  { path: 'instruments/:id', component: InstrumentDetailsComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order/:id', component: OrderComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'settlements', component: SettlementsComponent },
  { path: 'settlements/:id', component: SettlementDetailsComponent },
  { path: 'admin', component: AdminComponent },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class RoutingModule {}
