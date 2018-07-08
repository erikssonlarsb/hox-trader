import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule }  from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { BootstrapModule } from '../../../bootstrap.module';

import { AuthService } from '../../../services/auth/auth.service';
import { ApiService } from '../../../services/api/api.service';

import { OrderDetailsComponent } from './details.component';

describe('OrderComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService ],
      imports: [ HttpModule, RouterTestingModule, FormsModule, BootstrapModule ],
      declarations: [ OrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
