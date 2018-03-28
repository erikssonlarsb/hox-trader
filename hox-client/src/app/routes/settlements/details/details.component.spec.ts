import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule }  from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../../services/auth/auth.service';
import { ApiService } from '../../../services/api/api.service';

import { SettlementDetailsComponent } from './details.component';

describe('SettlementDetailsComponent', () => {
  let component: SettlementDetailsComponent;
  let fixture: ComponentFixture<SettlementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService],
      imports: [ HttpModule, RouterTestingModule ],
      declarations: [ SettlementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
