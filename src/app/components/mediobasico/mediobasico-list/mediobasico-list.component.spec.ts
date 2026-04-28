import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediobasicoList } from './mediobasico-list.component';

describe('MediobasicoList', () => {
  let component: MediobasicoList;
  let fixture: ComponentFixture<MediobasicoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediobasicoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediobasicoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
