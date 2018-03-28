import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule }  from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { BootstrapModule } from '../../bootstrap.module';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { OrderComponent } from './order.component';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService ],
      imports: [ HttpModule, RouterTestingModule, FormsModule, BootstrapModule ],
      declarations: [ OrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
