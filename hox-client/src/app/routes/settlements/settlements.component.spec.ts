import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementsComponent } from './settlements.component';

describe('TransactionsComponent', () => {
  let component: SettlementsComponent;
  let fixture: ComponentFixture<SettlementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
