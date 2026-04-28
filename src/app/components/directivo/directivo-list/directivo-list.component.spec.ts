import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivoList } from './directivo-list.component';

describe('DirectivoList', () => {
  let component: DirectivoList;
  let fixture: ComponentFixture<DirectivoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectivoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
