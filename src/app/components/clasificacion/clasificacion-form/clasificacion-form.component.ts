import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClasificacionService } from '../../../services/clasificacion/clasificacion.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-clasificacion-form.component',
  templateUrl: './clasificacion-form.component.html',
  styleUrl: './clasificacion-form.component.css',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,


  ],
})


export class ClasificacionFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private service: ClasificacionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({ descripcion: ['', Validators.required] });
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.service.getById(this.id).subscribe(data => this.form.patchValue(data));
    }
  }

  submit() {
    if (this.form.invalid) return;
    if (this.id) {
      this.service.update(this.id, this.form.value).subscribe(() => this.router.navigate(['/clasificacion']));
    } else {
      this.service.create(this.form.value).subscribe(() => this.router.navigate(['/clasificacion']));
    }
  }
}
