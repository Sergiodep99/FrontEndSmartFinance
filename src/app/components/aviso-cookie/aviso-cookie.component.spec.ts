import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoCookieComponent } from './aviso-cookie.component';

describe('AvisoCookieComponent', () => {
  let component: AvisoCookieComponent;
  let fixture: ComponentFixture<AvisoCookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvisoCookieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisoCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
