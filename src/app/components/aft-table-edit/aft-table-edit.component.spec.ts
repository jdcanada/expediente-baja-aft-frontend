import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AftTableEditComponent } from './aft-table-edit.component';


describe('AftTableEdit', () => {
  let component: AftTableEditComponent;
  let fixture: ComponentFixture<AftTableEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AftTableEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AftTableEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
