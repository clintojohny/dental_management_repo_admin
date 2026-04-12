import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Signup } from './auth/signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { Appointment } from './appointment/appointment';
import { Patients } from './patients/patients';
import { Prescriptions } from './prescriptions/prescriptions';
import { Billing } from './billing/billing';
import { Doctors } from './doctors/doctors';
import { Records } from './records/records';
import { Settings } from './settings/settings';
import { Hrms } from './hrms/hrms';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'dashboard', component: Dashboard },
  { path: 'appointments', component: Appointment },
  { path: 'patients', component: Patients },
  { path: 'doctors', component: Doctors },
  { path: 'prescriptions', component: Prescriptions },
  { path: 'billing', component: Billing },
  { path: 'records', component: Records },
  { path: 'hrms', component: Hrms },
  { path: 'settings', component: Settings }
];
