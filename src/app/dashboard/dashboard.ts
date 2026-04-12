import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Appointment {
  id: number;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  treatment: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  appointments: Appointment[] = [
    { id: 101, patientName: 'Alice Johnson', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-28', time: '09:00 AM', treatment: 'Braces Adjustment', status: 'Confirmed' },
    { id: 102, patientName: 'Bob Williams', doctor: 'Dr. Davis (General)', date: '2026-03-28', time: '10:30 AM', treatment: 'Teeth Cleaning', status: 'Pending' },
    { id: 103, patientName: 'Charlie Brown', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-28', time: '11:15 AM', treatment: 'Tooth Extraction', status: 'Cancelled' },
    { id: 104, patientName: 'Diana Prince', doctor: 'Dr. Evans (Surgeon)', date: '2026-03-28', time: '01:00 PM', treatment: 'Dental Implant', status: 'Confirmed' },
    { id: 105, patientName: 'Evan Wright', doctor: 'Dr. Davis (General)', date: '2026-03-29', time: '09:30 AM', treatment: 'Checkup & X-Ray', status: 'Pending' }
  ];

  getConfirmedCount() {
    return this.appointments.filter(a => a.status === 'Confirmed').length;
  }

  getPendingCount() {
    return this.appointments.filter(a => a.status === 'Pending').length;
  }

  getCancelledCount() {
    return this.appointments.filter(a => a.status === 'Cancelled').length;
  }

  currentPage = 1;
  pageSize = 3;

  get totalPages(): number {
    return Math.ceil(this.appointments.length / this.pageSize);
  }

  get paginatedAppointments(): Appointment[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.appointments.slice(start, start + this.pageSize);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
