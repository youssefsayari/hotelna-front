import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambresListComponent } from './chambres-list.component';

describe('ChambresListComponent', () => {
  let component: ChambresListComponent;
  let fixture: ComponentFixture<ChambresListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChambresListComponent]
    });
    fixture = TestBed.createComponent(ChambresListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
