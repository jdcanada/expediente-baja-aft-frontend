import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasificacionListComponent } from './clasificacion-list.component';

describe('ClasificacionList', () => {
  let component: ClasificacionListComponent;
  let fixture: ComponentFixture<ClasificacionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasificacionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasificacionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
