import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddGastoComponent } from './modal-add-gasto.component';

describe('ModalAddGastoComponent', () => {
  let component: ModalAddGastoComponent;
  let fixture: ComponentFixture<ModalAddGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddGastoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
