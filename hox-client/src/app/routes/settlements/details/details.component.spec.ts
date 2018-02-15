import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementDetailsComponent } from './details.component';

describe('SettlementDetailsComponent', () => {
  let component: SettlementDetailsComponent;
  let fixture: ComponentFixture<SettlementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
