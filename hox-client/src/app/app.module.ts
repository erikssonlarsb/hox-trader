import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { RoutingModule } from './routing.module';
import { MaterialModule } from './material.module';

import { AuthService } from './services/auth/auth.service';
import { ApiService } from './services/api/api.service';

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
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    RoutingModule,
    MaterialModule
  ],
  providers: [
    AuthService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
