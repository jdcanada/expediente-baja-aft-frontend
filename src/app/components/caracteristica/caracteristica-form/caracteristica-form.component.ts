import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaracteristicaService } from '../../../services/caracteristica/caracteristica.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-caracteristica-form',
  templateUrl: './caracteristica-form.component.html',
  styleUrl: './caracteristica-form.component.css',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,

  ],
})

export class CaracteristicaFormComponent implements OnInit {
  form!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private caracteristicaService: CaracteristicaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.fb.group({ descripcion: ['', Validators.required] });
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.caracteristicaService.getById(this.id).subscribe(data => this.form?.patchValue(data));
    }
  }

  submit() {
    if (this.form.invalid) return;
    const data = this.form.value;

    if (this.id) {
      this.caracteristicaService.update(this.id, data).subscribe({
        next: (res) => {
          this.router.navigate(['/caracteristica/all']);
        },
        error: (err) => { }
      });

    } else {
      this.caracteristicaService.create(data).subscribe({
        next: (res) => {
          setTimeout(() => {
            this.router.navigate(['/caracteristica/all']);
          }, 300);



        },
        error: (err) => { }
      });
    }
  }
}
