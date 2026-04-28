import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionmiembrosList } from './comisionmiembros-list.component';

describe('ComisionmiembrosList', () => {
  let component: ComisionmiembrosList;
  let fixture: ComponentFixture<ComisionmiembrosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComisionmiembrosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComisionmiembrosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
