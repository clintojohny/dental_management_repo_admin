import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  activeTab = 'profile';
  showSavedMessage = false;

  // Profile
  profile = {
    name: 'Dr. Robert Smith',
    email: 'dr.smith@dentalcare.com',
    phone: '(555) 100-2001',
    specialization: 'Orthodontist',
    qualification: 'BDS, MDS - Orthodontics',
    bio: 'Experienced orthodontist with 12+ years of practice specializing in braces, aligners, and corrective jaw treatments.',
    avatar: 'https://i.pravatar.cc/150?img=68'
  };

  // Clinic
  clinic = {
    name: 'DentalCare Clinic',
    address: '123 Dental Street, Medical City',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    phone: '(555) 000-1234',
    email: 'info@dentalcare.com',
    website: 'www.dentalcare.com',
    openTime: '09:00',
    closeTime: '18:00',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  };

  allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Notifications
  notifications = {
    emailAppointment: true,
    emailCancellation: true,
    emailNewPatient: false,
    emailBilling: true,
    smsReminder: true,
    smsConfirmation: true,
    smsCancellation: false,
    pushAppointment: true,
    pushReminder: true,
    pushBilling: false
  };

  // Security
  security = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true
  };

  // Appearance
  appearance = {
    theme: 'dark',
    sidebarColor: 'white',
    fontSize: 'medium',
    compactMode: false,
    animationsEnabled: true
  };

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    this.appearance.theme = savedTheme === 'light' ? 'light' : 'dark';
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  toggleWorkingDay(day: string) {
    const index = this.clinic.workingDays.indexOf(day);
    if (index > -1) {
      this.clinic.workingDays.splice(index, 1);
    } else {
      this.clinic.workingDays.push(day);
    }
  }

  isWorkingDay(day: string): boolean {
    return this.clinic.workingDays.includes(day);
  }

  changeTheme(theme: string) {
    this.appearance.theme = theme;
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }

  saveSettings() {
    this.showSavedMessage = true;
    setTimeout(() => {
      this.showSavedMessage = false;
    }, 3000);
  }

  changePassword() {
    if (!this.security.currentPassword || !this.security.newPassword || !this.security.confirmPassword) {
      alert('Please fill all password fields.');
      return;
    }
    if (this.security.newPassword !== this.security.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    if (this.security.newPassword.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    this.security.currentPassword = '';
    this.security.newPassword = '';
    this.security.confirmPassword = '';
    this.saveSettings();
  }
}
