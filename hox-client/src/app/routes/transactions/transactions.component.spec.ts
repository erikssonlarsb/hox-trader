import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule }  from '@angular/http';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { TransactionsComponent } from './transactions.component';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService],
      imports: [ HttpModule ],
      declarations: [ TransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
