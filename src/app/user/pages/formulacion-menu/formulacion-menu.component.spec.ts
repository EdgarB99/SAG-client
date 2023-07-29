import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulacionMenuComponent } from './formulacion-menu.component';

describe('FormulacionMenuComponent', () => {
  let component: FormulacionMenuComponent;
  let fixture: ComponentFixture<FormulacionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulacionMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulacionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
