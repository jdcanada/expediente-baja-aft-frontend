import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Estructura_Areas_Personas, EstructuraDetalle_Dic_Mov_Inf } from '../../../models/estructura';
import { EstructuraService } from '../../../services/estructura/estructura.service';
import { Cargo } from '../../../models/cargo';
import { CargoService } from '../../../services/cargo/cargo.service';
import { CommonModule } from '@angular/common';
import { PersonaService } from '../../../services/persona/persona.service';
import {  PersonaById } from '../../../models/persona';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
  ],
})
export class PersonaFormComponent implements OnInit {
  form!: FormGroup;
  estruturas: Estructura_Areas_Personas[] = [];
  cargos: Cargo[] = [];
  idpersona: number | null = null;
  edit: boolean = false;

  constructor(
    private estructuraService: EstructuraService,
    private cargoService: CargoService,
    private personaService: PersonaService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      idpersona: [null],
      solapin: ['', [Validators.required, Validators.maxLength(10)]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      cargo_id: ['', Validators.required],
      estructura_id: ['', Validators.required],
    });

    this.loadCargos();
    this.loadEstruturas();

    // Obtener idpersona del parámetro de ruta
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.edit = true;
        const id = +idParam; // Convertir a número
        this.loadPersona(id); // Llamar a tu método para cargar datos
      }
    });
  }

  loadCargos() {
    this.cargoService.listAll().subscribe({
      next: res => {
        this.cargos = res;
        this.cdr.detectChanges();
      },
    });
  }

  loadEstruturas() {
    this.estructuraService.listAll().subscribe({
      next: res => {
        this.estruturas = res;
        this.cdr.detectChanges();
      },
    });
  }

  // Nuevo método para cargar persona por id
  loadPersona(id: number) {
    this.personaService.getById(id).subscribe({
      next: (persona: PersonaById) => {
        // Popular el formulario con los datos recibidos
        console.log(persona)
        this.form.patchValue({
          idpersona:persona.idpersona,
          solapin: persona.solapin,
          nombre: persona.nombre,
          apellidos: persona.apellidos,
          correo: persona.correo,
          cargo_id: persona.cargo_id,
          estructura_id: persona.estructura_id,
        });
      },
      error: (err) => {
        console.error('Error al cargar persona:', err);
      }
    });
  }

  submitForm() {
  if (this.form.valid) {
    const personaData = this.form.value;
    
    if (personaData.idpersona) {
      //Modificar persona existente
      this.personaService.update(personaData.idpersona, personaData).subscribe({
        next: (response) => {
          console.log('Persona actualizada correctamente:', response);
          // Aquí puedes agregar lógica para notificar éxito, navegar, etc.
          this.router.navigate(['/personas/all']);
         
        },
        error: (error) => {
          console.error('Error al actualizar la persona:', error);
          // Aquí puedes mostrar un mensaje de error al usuario
        }
      });
    } else {
      //Crear nueva persona
      this.personaService.create(personaData).subscribe({
        next: (response) => {
          console.log('Persona creada correctamente:', response);
          // Aquí puedes agregar lógica para notificar éxito, navegar, etc.
        },
        error: (error) => {
          console.error('Error al crear la persona:', error);
          // Aquí puedes mostrar un mensaje de error al usuario
        }
      });
    }
  } else {
    this.form.markAllAsTouched();
  }
}


  cerrar(){
    
  }
}
