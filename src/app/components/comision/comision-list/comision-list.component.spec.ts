import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionList } from './comision-list.component';

describe('ComisionList', () => {
  let component: ComisionList;
  let fixture: ComponentFixture<ComisionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComisionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
