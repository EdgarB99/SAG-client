import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVacaComponent } from './modal-vaca.component';

describe('ModalVacaComponent', () => {
  let component: ModalVacaComponent;
  let fixture: ComponentFixture<ModalVacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVacaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
