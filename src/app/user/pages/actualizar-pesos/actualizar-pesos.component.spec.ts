import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarPesosComponent } from './actualizar-pesos.component';

describe('ActualizarPesosComponent', () => {
  let component: ActualizarPesosComponent;
  let fixture: ComponentFixture<ActualizarPesosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarPesosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarPesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
