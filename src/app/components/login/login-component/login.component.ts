import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [] // no necesitas formularios si redireccionas
})
export class LoginComponent {

  constructor(private router: Router) { }

  login() {
    // Redirigir al backend que inicia el login CAS
    window.location.href = 'http://10.8.117.222:3001/auth/login';
  }
}













// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     ReactiveFormsModule, 
//     MatInputModule, 
//     MatButtonModule,
//     RouterModule,
//   ],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder, private router: Router) {
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required]
//     });
//   }

//   onSubmit() {
//     if (this.loginForm.valid) {
//       const { username, password } = this.loginForm.value;
//       // Aquí iría la lógica de autenticación
//       this.router.navigate(['/home']);
//       console.log('Login con:', username, password);
//     }
//   }
// }
