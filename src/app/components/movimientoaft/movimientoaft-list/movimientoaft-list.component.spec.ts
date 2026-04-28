import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoaftList } from './movimientoaft-list.component';

describe('MovimientoaftList', () => {
  let component: MovimientoaftList;
  let fixture: ComponentFixture<MovimientoaftList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoaftList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoaftList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
