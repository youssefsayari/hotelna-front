import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipateActivityComponent } from './participate-activity.component';

describe('ParticipateActivityComponent', () => {
  let component: ParticipateActivityComponent;
  let fixture: ComponentFixture<ParticipateActivityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticipateActivityComponent]
    });
    fixture = TestBed.createComponent(ParticipateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
