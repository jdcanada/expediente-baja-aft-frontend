import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictamenForm } from './dictamen-form.component';

describe('DictamenForm', () => {
  let component: DictamenForm;
  let fixture: ComponentFixture<DictamenForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictamenForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictamenForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
