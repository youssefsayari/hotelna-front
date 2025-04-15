import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityStatsComponent } from './activity-stats.component';

describe('ActivityStatsComponent', () => {
  let component: ActivityStatsComponent;
  let fixture: ComponentFixture<ActivityStatsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityStatsComponent]
    });
    fixture = TestBed.createComponent(ActivityStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
