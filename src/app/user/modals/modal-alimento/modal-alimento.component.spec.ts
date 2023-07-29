import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAlimentoComponent } from './modal-alimento.component';

describe('ModalAlimentoComponent', () => {
  let component: ModalAlimentoComponent;
  let fixture: ComponentFixture<ModalAlimentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAlimentoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAlimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
