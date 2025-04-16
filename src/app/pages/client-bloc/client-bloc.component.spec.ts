import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBlocComponent } from './client-bloc.component';

describe('ClientBlocComponent', () => {
  let component: ClientBlocComponent;
  let fixture: ComponentFixture<ClientBlocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientBlocComponent]
    });
    fixture = TestBed.createComponent(ClientBlocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
