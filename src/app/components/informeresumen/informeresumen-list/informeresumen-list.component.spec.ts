import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeresumenList } from './informeresumen-list.component';

describe('InformeresumenList', () => {
  let component: InformeresumenList;
  let fixture: ComponentFixture<InformeresumenList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformeresumenList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformeresumenList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
