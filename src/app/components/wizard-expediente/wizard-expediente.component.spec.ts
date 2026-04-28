import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardExpedienteComponent } from './wizard-expediente.component';

describe('WizardExpediente', () => {
  let component: WizardExpedienteComponent;
  let fixture: ComponentFixture<WizardExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardExpedienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
