import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictamenList } from './dictamen-list.component';

describe('DictamenList', () => {
  let component: DictamenList;
  let fixture: ComponentFixture<DictamenList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictamenList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictamenList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
