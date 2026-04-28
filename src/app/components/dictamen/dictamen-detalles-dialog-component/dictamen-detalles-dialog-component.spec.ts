import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictamenDetallesDialogComponent } from './dictamen-detalles-dialogcomponent';

describe('DictamenDetallesDialogComponent', () => {
  let component: DictamenDetallesDialogComponent;
  let fixture: ComponentFixture<DictamenDetallesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictamenDetallesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictamenDetallesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
