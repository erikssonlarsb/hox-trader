import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewComponent } from './routes/overview/overview.component';
import { LoginComponent } from './routes/login/login.component';
import { OrderComponent } from './routes/order/order.component';
import { TransactionsComponent } from './routes/transactions/transactions.component';
import { OrdersComponent } from './routes/orders/orders.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order/:id', component: OrderComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'orders', component: OrdersComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class RoutingModule {}
