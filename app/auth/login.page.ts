// src/app/auth/login.page.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';  // ← import
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private storage: StorageService    // ← inject
  ) {}

  submit() {
    if (this.form.invalid) {
      return;
    }
    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: async () => {
        // Persist credentials for Settings page
        await this.storage.set('userEmail',    email!);
        await this.storage.set('userPassword', password!);

        // Navigate into the app
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: (err) => {
        console.error(err);
        // TODO: show a toast or alert to the user
      },
    });
  }
}
