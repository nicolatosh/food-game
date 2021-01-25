import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitOpponentComponent } from './wait-opponent.component';

describe('WaitOpponentComponent', () => {
  let component: WaitOpponentComponent;
  let fixture: ComponentFixture<WaitOpponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitOpponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitOpponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
