import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddIngresoComponent } from './modal-add-ingreso.component';

describe('ModalAddIngresoComponent', () => {
  let component: ModalAddIngresoComponent;
  let fixture: ComponentFixture<ModalAddIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddIngresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
