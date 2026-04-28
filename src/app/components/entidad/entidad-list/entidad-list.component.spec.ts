import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadList } from './entidad-list.component';

describe('EntidadList', () => {
  let component: EntidadList;
  let fixture: ComponentFixture<EntidadList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntidadList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
