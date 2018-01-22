import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { RoutingModule } from './routing.module';
import { MaterialModule } from './material.module';

import { AuthService } from './services/auth/auth.service';

import { LoginComponent } from './routes/login/login.component';
import { OverviewComponent } from './routes/overview/overview.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RoutingModule,
    MaterialModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
