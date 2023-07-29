import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotesComponent } from "./LotesComponent";

describe('LotesComponent', () => {
  let component: LotesComponent;
  let fixture: ComponentFixture<LotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
