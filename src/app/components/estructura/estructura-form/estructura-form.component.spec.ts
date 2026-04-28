import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstructuraFormComponent } from './estructura-form.component';

describe('EstructuraFormComponent', () => {
  let component: EstructuraFormComponent;
  let fixture: ComponentFixture<EstructuraFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstructuraFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstructuraFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
