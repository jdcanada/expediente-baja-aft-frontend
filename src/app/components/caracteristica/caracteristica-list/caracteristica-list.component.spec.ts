import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracteristicaList } from './caracteristica-list.component';

describe('CaracteristicaList', () => {
  let component: CaracteristicaList;
  let fixture: ComponentFixture<CaracteristicaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaracteristicaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaracteristicaList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
