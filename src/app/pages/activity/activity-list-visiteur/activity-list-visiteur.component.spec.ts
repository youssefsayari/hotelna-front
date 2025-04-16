import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityListVisiteurComponent } from './activity-list-visiteur.component';

describe('ActivityListVisiteurComponent', () => {
  let component: ActivityListVisiteurComponent;
  let fixture: ComponentFixture<ActivityListVisiteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityListVisiteurComponent]
    });
    fixture = TestBed.createComponent(ActivityListVisiteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
