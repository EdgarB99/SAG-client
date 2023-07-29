import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDosisComponent } from './agregar-dosis.component';

describe('AgregarDosisComponent', () => {
  let component: AgregarDosisComponent;
  let fixture: ComponentFixture<AgregarDosisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarDosisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarDosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
