import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolForm } from './rol-form.component';

describe('RolForm', () => {
  let component: RolForm;
  let fixture: ComponentFixture<RolForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
