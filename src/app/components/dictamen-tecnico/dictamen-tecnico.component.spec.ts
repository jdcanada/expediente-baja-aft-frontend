import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictamenTecnicoComponent } from './dictamen-tecnico.component';

describe('DictamenTecnico', () => {
  let component: DictamenTecnicoComponent;
  let fixture: ComponentFixture<DictamenTecnicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DictamenTecnicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictamenTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
