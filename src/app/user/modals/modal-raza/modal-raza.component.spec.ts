import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRazaComponent } from './modal-raza.component';

describe('ModalRazaComponent', () => {
  let component: ModalRazaComponent;
  let fixture: ComponentFixture<ModalRazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRazaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
