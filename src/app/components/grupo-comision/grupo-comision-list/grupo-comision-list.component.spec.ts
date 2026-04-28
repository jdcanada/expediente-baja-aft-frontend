import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoComisionList } from './grupo-comision-list.component';

describe('GrupoComisionList', () => {
  let component: GrupoComisionList;
  let fixture: ComponentFixture<GrupoComisionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrupoComisionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrupoComisionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
