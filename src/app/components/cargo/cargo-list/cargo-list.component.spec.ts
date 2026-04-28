import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoList } from './cargo-list.component';

describe('CargoList', () => {
  let component: CargoList;
  let fixture: ComponentFixture<CargoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
