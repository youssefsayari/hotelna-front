import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambresVisiteurComponent } from './chambres-visiteur.component';

describe('ChambresVisiteurComponent', () => {
  let component: ChambresVisiteurComponent;
  let fixture: ComponentFixture<ChambresVisiteurComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChambresVisiteurComponent]
    });
    fixture = TestBed.createComponent(ChambresVisiteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
