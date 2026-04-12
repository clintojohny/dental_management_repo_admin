import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AppointmentData {
  id: number;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  treatment: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css'
})
export class Appointment implements OnInit {
  isModalOpen = false;
  isEditing = false;
  editingAppointmentId: number | null = null;
  searchTerm = '';
  filteredAppointments: AppointmentData[] = [];
  currentPage = 1;
  pageSize = 3;

  newAppointment: Partial<AppointmentData> = {
    patientName: '',
    doctor: '',
    date: '',
    time: '',
    treatment: '',
    status: 'Pending'
  };

  appointments: AppointmentData[] = [
    { id: 101, patientName: 'Alice Johnson', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-28', time: '09:00 AM', treatment: 'Braces Adjustment', status: 'Confirmed' },
    { id: 102, patientName: 'Bob Williams', doctor: 'Dr. Davis (General)', date: '2026-03-28', time: '10:30 AM', treatment: 'Teeth Cleaning', status: 'Pending' },
    { id: 103, patientName: 'Charlie Brown', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-28', time: '11:15 AM', treatment: 'Tooth Extraction', status: 'Cancelled' },
    { id: 104, patientName: 'Diana Prince', doctor: 'Dr. Evans (Surgeon)', date: '2026-03-28', time: '01:00 PM', treatment: 'Dental Implant', status: 'Confirmed' },
    { id: 105, patientName: 'Evan Wright', doctor: 'Dr. Davis (General)', date: '2026-03-29', time: '09:30 AM', treatment: 'Checkup & X-Ray', status: 'Pending' }
  ];

  ngOnInit() {
    this.filteredAppointments = [...this.appointments];
  }

  filterAppointments() {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredAppointments = [...this.appointments];
      return;
    }
    this.filteredAppointments = this.appointments.filter(apt =>
      apt.patientName.toLowerCase().includes(term) ||
      apt.doctor.toLowerCase().includes(term) ||
      apt.treatment.toLowerCase().includes(term) ||
      apt.status.toLowerCase().includes(term) ||
      apt.time.toLowerCase().includes(term)
    );
  }

  updateStatus(id: number, status: 'Confirmed' | 'Pending' | 'Cancelled') {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      this.filterAppointments();
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditing = false;
    this.editingAppointmentId = null;
    this.newAppointment = {
      patientName: '',
      doctor: '',
      date: '',
      time: '',
      treatment: '',
      status: 'Pending'
    };
  }

  editAppointment(apt: AppointmentData) {
    this.isEditing = true;
    this.editingAppointmentId = apt.id;
    this.newAppointment = { ...apt };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.pageSize);
  }

  get paginatedAppointments(): AppointmentData[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAppointments.slice(start, start + this.pageSize);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  saveAppointment() {
    if (this.newAppointment.patientName && this.newAppointment.date && this.newAppointment.time && this.newAppointment.doctor) {
      if (this.isEditing && this.editingAppointmentId) {
        const index = this.appointments.findIndex(a => a.id === this.editingAppointmentId);
        if (index > -1) {
          this.appointments[index] = { ...this.appointments[index], ...this.newAppointment } as AppointmentData;
        }
      } else {
        const nextId = Math.max(...this.appointments.map(a => a.id)) + 1;
        this.appointments.unshift({
          id: nextId,
          patientName: this.newAppointment.patientName!,
          doctor: this.newAppointment.doctor!,
          date: this.newAppointment.date!,
          time: this.newAppointment.time!,
          treatment: this.newAppointment.treatment || 'Consultation',
          status: 'Pending'
        });
      }
      this.filterAppointments();
      this.closeModal();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
