import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivoForm } from './directivo-form.component';

describe('DirectivoForm', () => {
  let component: DirectivoForm;
  let fixture: ComponentFixture<DirectivoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectivoForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
