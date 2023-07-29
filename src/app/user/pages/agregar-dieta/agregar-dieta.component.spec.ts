import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDietaComponent } from './agregar-dieta.component';

describe('AgregarDietaComponent', () => {
  let component: AgregarDietaComponent;
  let fixture: ComponentFixture<AgregarDietaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarDietaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarDietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
