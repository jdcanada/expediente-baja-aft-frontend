import { Component, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpedienteFormulario, ExpedienteFormulario2 } from '../../../models/expedienteformulario';
import { EstructuraService } from '../../../services/estructura/estructura.service';
import { PersonaService } from '../../../services/persona/persona.service';
import { Persona, PersonaListItem2 } from '../../../models/persona';
import { Estructura, Estructura_Areas_Personas, EstructuraDetalle_Dic_Mov_Inf } from '../../../models/estructura';
import { ComisionmiembrosService } from '../../../services/comisionmiembros/comisionmiembros.service';
import { ComisionMiembro, ComisionMiembroDetalle, JefeComision } from '../../../models/comisionMiembro';
import { GrupoComision, GrupoComision2 } from '../../../models/grupoComision';
import { ExpedienteService } from '../../../services/expediente/expediente.service';

@Component({
  selector: 'app-expediente-form',
  templateUrl: './expediente-form.component.html',
  styleUrls: ['./expediente-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],

})
export class ExpedienteFormComponent {
  @Output() formCompleted = new EventEmitter<ExpedienteFormulario>();
  form: FormGroup;

  estructuras: Estructura_Areas_Personas[] = [];
  personasDirectivas: PersonaListItem2[] = [];
  comisionmiembros: ComisionMiembroDetalle[] = [];
  jefesComisiones: JefeComision[] = [];

  constructor(
    private fb: FormBuilder,
    private estructuraService: EstructuraService,
    private personaService: PersonaService,
    private comisionmiembrosService: ComisionmiembrosService,
    private expedienteService: ExpedienteService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {
    this.form = this.fb.group({
      no_expediente: ['', Validators.required],
      fecha_creacion: ['', Validators.required],
      estructura_id: ['', Validators.required],
      centroCostoCodigo: [{ value: '', disabled: true }],  // Sin Validators.required
      centroCostoNombre: [{ value: '', disabled: true }],  // Sin Validators.required
      direccionSolicita: [{ value: '', disabled: true }],  // Sin Validators.required
      areaEntrega: [{ value: '', disabled: true }],        // Sin Validators.required
      nombreSolicitante: ['', Validators.required],
      cargoSolicitante: [{ value: '', disabled: true }],   // Sin Validators.required
      telefono: [{ value: '', disabled: true }],           // Sin Validators.required
      nombreJefeAprueba: ['', Validators.required],
      cargoJefeAprueba: [{ value: '', disabled: true }],   // Sin Validators.required
      jefeComision: [''],
      miembro1: [''],
      miembro2: [''],
      miembro3: [''],
      miembro4: [''],
      areaRecibe: ['', Validators.required],
      fechaActa: [''],
      horaActa: [''],
    });


    this.loadEstructuras();
    this.loadPersonasDirectivas();
    this.loadComisionesMiembros();
    this.loadJefesComisiones();

    this.form.get('estructura_id')?.valueChanges.subscribe(idEstructura => {
      this.onEstructuraSelected(idEstructura);
    });

    this.form.get('nombreSolicitante')?.valueChanges.subscribe(idPersona => {
      this.onSolicitanteSelected(idPersona);
    });

    this.form.get('nombreJefeAprueba')?.valueChanges.subscribe(idPersona => {
      this.onJefeApruebaSelected(idPersona);
    });

    this.form.get('jefeComision')?.valueChanges.subscribe(idjefeComision => {
      this.onComisionSelected(idjefeComision);
    });
  }

  loadEstructuras() {
    this.estructuraService.listAll().subscribe(data => {
      this.ngZone.run(() => {
        this.estructuras = data;
        this.cdRef.detectChanges();
      });
    });
  }

  loadPersonasDirectivas() {
    this.personaService.getDirectivos().subscribe(data => {
      this.personasDirectivas = data;
      this.cdRef.detectChanges();
    });
  }

  loadComisionesMiembros() {
    this.comisionmiembrosService.listAll().subscribe(data => {
      this.comisionmiembros = data;
      this.cdRef.detectChanges();
    });
  }

  loadJefesComisiones() {
    this.comisionmiembrosService.getJefescomisiones().subscribe(data => {
      this.jefesComisiones = data;
      this.cdRef.detectChanges();
    });
  }


  onEstructuraSelected(id: number) {

    const estructura = this.estructuras.find(e => e.idestructura == id);
    if (estructura) {
      this.form.patchValue({
        centroCostoCodigo: estructura.codigo_centro_costo,
        centroCostoNombre: estructura.nombre_estructura,
        direccionSolicita: estructura.nombre_estructura,
        areaEntrega: estructura.nombre_estructura,
        areaRecibe: 'Dirección de Servicios Generales', //estructura.nombre_estructura, // o lo que corresponda
      });
    }
  }

  onSolicitanteSelected(idPersona: number) {

    const persona = this.personasDirectivas.find(p => p.idpersona == idPersona);
    if (persona) {
      this.form.patchValue({
        cargoSolicitante: persona.nombre_cargo,
        telefono: persona.telefono_corporativo || '',
      });
    }
  }

  onJefeApruebaSelected(idPersona: number) {
    const persona = this.personasDirectivas.find(p => p.idpersona == idPersona);
    if (persona) {
      this.form.patchValue({
        cargoJefeAprueba: persona.nombre_cargo,
      });
    }
  }

  onComisionSelected(idjefeComision: number) {
    this.comisionmiembrosService.getById(idjefeComision).subscribe({
      next: res => {
        const idgrupo = res.grupo_id;
        if (idgrupo !== null) {
          this.comisionmiembrosService.MiembrosPorGrupo(idgrupo).subscribe({
            next: (grupo: GrupoComision2) => {
              if (!grupo || !grupo.miembros || grupo.miembros.length === 0) {
                this.form.patchValue({
                  // jefeComision: '',
                  miembro1: '',
                  miembro2: '',
                  miembro3: '',
                  miembro4: '',
                });
                return;
              }

              const responsable = grupo.miembros.find(m => m.es_responsable);

              this.form.patchValue({
                // jefeComision: responsable ? `${responsable.persona.nombre} ${responsable.persona.apellidos}` : '',
                miembro1: grupo.miembros[1] ? `${grupo.miembros[1].persona.nombre} ${grupo.miembros[1].persona.apellidos}` : '',
                miembro2: grupo.miembros[2] ? `${grupo.miembros[2].persona.nombre} ${grupo.miembros[2].persona.apellidos}` : '',
                miembro3: grupo.miembros[3] ? `${grupo.miembros[3].persona.nombre} ${grupo.miembros[3].persona.apellidos}` : '',
                miembro4: grupo.miembros[4] ? `${grupo.miembros[4].persona.nombre} ${grupo.miembros[4].persona.apellidos}` : '',
              });
              this.cdRef.detectChanges();
            },
            error: err => {
              console.error('Error al obtener miembros por grupo:', err);
            }
          });

        } else {
          console.log("No existen un grupo para este jefe de comisión");
          this.form.patchValue({
            jefeComision: '',
            miembro1: '',
            miembro2: '',
            miembro3: '',
            miembro4: '',
          });
        }
      },
      error: err => {
        console.error('Error al obtener datos del jefe de comisión:', err);
      }
    });
  }


  submitForm() {
    if (this.form.valid) {
      const no_expediente = this.form.get('no_expediente')?.value;
      const fecha_creacion = this.form.get('fecha_creacion')?.value;
      const estado = "Iniciado";
      const estructura_id = this.form.get('estructura_id')?.value;

      const expedienteData: ExpedienteFormulario = this.form.getRawValue();
      // console.log(expedienteData)
      // this.expedienteService.create(expedienteData).subscribe(response => {
      //   const expedienteData: ExpedienteFormulario = this.form.getRawValue();

      // });

      this.formCompleted.emit(expedienteData);
      const centroCostoCodigo = this.form.get('centroCostoCodigo');
      const centroCostoNombre = this.form.get('centroCostoNombre');
      const direccionSolicita = this.form.get('direccionSolicita');
      const areaEntrega = this.form.get('areaEntrega');
      const nombreSolicitante_id = this.form.get('nombreSolicitante_id');
      const cargoSolicitante = this.form.get('cargoSolicitante');
      const telefono = this.form.get('telefono');
      const nombreJefeAprueba_id = this.form.get('nombreJefeAprueba_id');
      const cargoJefeAprueba = this.form.get('cargoJefeAprueba');
      const jefeComision_id = this.form.get('jefeComision_id');
      const miembro1 = this.form.get('miembro1');
      const miembro2 = this.form.get('miembro2');
      const miembro3 = this.form.get('miembro3');
      const miembro4 = this.form.get('miembro4');
      const areaRecibe = this.form.get('areaRecibe');



    }
  }
}
