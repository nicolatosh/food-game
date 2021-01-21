import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameendComponent } from './gameend.component';

describe('GameendComponent', () => {
  let component: GameendComponent;
  let fixture: ComponentFixture<GameendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
