import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarPesoComponent } from './actualizar-peso.component';

describe('ActualizarPesoComponent', () => {
  let component: ActualizarPesoComponent;
  let fixture: ComponentFixture<ActualizarPesoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarPesoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarPesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
