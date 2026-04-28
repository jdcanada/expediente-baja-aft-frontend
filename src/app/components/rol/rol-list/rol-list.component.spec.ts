import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolList } from './rol-list.component';

describe('RolList', () => {
  let component: RolList;
  let fixture: ComponentFixture<RolList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
