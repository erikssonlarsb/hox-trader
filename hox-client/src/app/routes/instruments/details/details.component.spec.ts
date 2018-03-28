import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule }  from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { ChartsModule } from 'ng2-charts';

import { AuthService } from '../../../services/auth/auth.service';
import { ApiService } from '../../../services/api/api.service';

import { InstrumentDetailsComponent } from './details.component';

describe('InstrumentDetailsComponent', () => {
  let component: InstrumentDetailsComponent;
  let fixture: ComponentFixture<InstrumentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService],
      imports: [ HttpModule, RouterTestingModule, ChartsModule ],
      declarations: [ InstrumentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
