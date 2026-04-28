import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionFormComponent } from './clasificacion-form.component';

describe('ClasificacionForm', () => {
  let component: ClasificacionFormComponent;
  let fixture: ComponentFixture<ClasificacionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasificacionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasificacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
