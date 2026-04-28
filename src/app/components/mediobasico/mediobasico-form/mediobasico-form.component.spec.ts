import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediobasicoForm } from './mediobasico-form.component';

describe('MediobasicoForm', () => {
  let component: MediobasicoForm;
  let fixture: ComponentFixture<MediobasicoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediobasicoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediobasicoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
