import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule }  from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../services/auth/auth.service';
import { ApiService } from '../../services/api/api.service';

import { InstrumentsComponent } from './instruments.component';

describe('InstrumentsComponent', () => {
  let component: InstrumentsComponent;
  let fixture: ComponentFixture<InstrumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService],
      imports: [ HttpModule, RouterTestingModule ],
      declarations: [ InstrumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
