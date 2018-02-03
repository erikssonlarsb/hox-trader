import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './routes/login/login.component';
import { RegisterComponent } from './routes/register/register.component';
import { OverviewComponent } from './routes/overview/overview.component';
import { OrderComponent } from './routes/order/order.component';
import { TransactionsComponent } from './routes/transactions/transactions.component';
import { OrdersComponent } from './routes/orders/orders.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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
