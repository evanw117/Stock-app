// src/app/settings/settings.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule }       from '@ionic/angular';
import { CommonModule }      from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StorageService }    from '../services/storage.service';  // <-- import StorageService

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userEmail     = '';
  password      = '';
  showPassword  = false;
  darkMode      = false;
  alertsEnabled = false;

  constructor(
    private router: Router,
    private storage: StorageService         // <-- inject StorageService
  ) {}

  async ngOnInit() {
    // load stored values (or sensible defaults)
    this.userEmail     = await this.storage.get('userEmail')   || 'user@example.com';
    this.password      = await this.storage.get('userPassword')|| '';
    this.alertsEnabled = (await this.storage.get('alertsEnabled')) === 'true';
    this.darkMode      = (await this.storage.get('darkMode'))     === 'true';
    document.body.classList.toggle('dark', this.darkMode);
  }

  /** returns a string of asterisks matching password length */
  get maskedPassword(): string {
    return '*'.repeat(this.password.length);
  }

  /** flip between showing and hiding the password */
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  changePassword() {
    this.router.navigateByUrl('/change-password');
  }

  toggleDarkMode(event: CustomEvent) {
    this.darkMode = event.detail.checked;
    document.body.classList.toggle('dark', this.darkMode);
    this.storage.set('darkMode', String(this.darkMode));      // <-- persist
  }

  toggleAlerts(event: CustomEvent) {
    this.alertsEnabled = event.detail.checked;
    this.storage.set('alertsEnabled', String(this.alertsEnabled));
  }

  clearCache() {
    localStorage.clear();
    window.location.reload();
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  goToHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
  goToSearch() {
    this.router.navigateByUrl('/search', { replaceUrl: true });
  }
  goToSettings() {
    this.router.navigateByUrl('/settings', { replaceUrl: true });
  }
}
