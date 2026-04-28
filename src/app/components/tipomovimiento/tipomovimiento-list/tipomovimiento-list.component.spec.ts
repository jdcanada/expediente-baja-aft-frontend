import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipomovimientoList } from './tipomovimiento-list.component';

describe('TipomovimientoList', () => {
  let component: TipomovimientoList;
  let fixture: ComponentFixture<TipomovimientoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipomovimientoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipomovimientoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
