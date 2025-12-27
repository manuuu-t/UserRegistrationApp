import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  passwordRule = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
  registerForm: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRule)]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.pattern(/^[0-9]{10}$/)]]
    }, { validators: this.passwordMatch });
  }

  passwordMatch(form: any) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null : { mismatch: true };
  }

register() {

  const body = {
    FirstName: this.registerForm.value.firstName,
    LastName: this.registerForm.value.lastName,
    DateOfBirth: this.registerForm.value.dob,
    Email: this.registerForm.value.email,
    Password: this.registerForm.value.password,
    PhoneNumber: this.registerForm.value.phone
  };

  this.http.post(
    "http://localhost:5010/api/register",
    body,
    { responseType: 'text' }        // 👈 ADD THIS
  )
  .subscribe({
    next: res => {
      alert(res);                  // 👈 will show "Registered Successfully"
    },
    error: err => {
  console.log(err);
  alert("Registration Failed: " + (err.error || err.message));
}

  });
}


}
