import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermisoComponent } from './role-permiso.component';

describe('RolForm', () => {
  let component: RolePermisoComponent;
  let fixture: ComponentFixture<RolePermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolePermisoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
