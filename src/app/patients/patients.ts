import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  lastVisit: string;
  totalVisits: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.html',
  styleUrl: './patients.css'
})
export class Patients implements OnInit {
  isModalOpen = false;
  isEditing = false;
  editingPatientId: number | null = null;
  searchTerm = '';
  filteredPatients: Patient[] = [];
  currentPage = 1;
  pageSize = 5;

  newPatient: Partial<Patient> = {
    name: '',
    age: undefined,
    gender: undefined,
    phone: '',
    email: '',
    status: 'Active'
  };

  patients: Patient[] = [
    { id: 1001, name: 'Alice Johnson', age: 32, gender: 'Female', phone: '(555) 123-4567', email: 'alice.j@email.com', lastVisit: '2026-03-28', totalVisits: 8, status: 'Active' },
    { id: 1002, name: 'Bob Williams', age: 45, gender: 'Male', phone: '(555) 234-5678', email: 'bob.w@email.com', lastVisit: '2026-03-25', totalVisits: 12, status: 'Active' },
    { id: 1003, name: 'Charlie Brown', age: 28, gender: 'Male', phone: '(555) 345-6789', email: 'charlie.b@email.com', lastVisit: '2026-03-20', totalVisits: 3, status: 'Active' },
    { id: 1004, name: 'Diana Prince', age: 38, gender: 'Female', phone: '(555) 456-7890', email: 'diana.p@email.com', lastVisit: '2026-03-15', totalVisits: 15, status: 'Active' },
    { id: 1005, name: 'Evan Wright', age: 52, gender: 'Male', phone: '(555) 567-8901', email: 'evan.w@email.com', lastVisit: '2026-02-10', totalVisits: 6, status: 'Inactive' },
    { id: 1006, name: 'Fiona Garcia', age: 29, gender: 'Female', phone: '(555) 678-9012', email: 'fiona.g@email.com', lastVisit: '2026-03-27', totalVisits: 4, status: 'Active' },
    { id: 1007, name: 'George Lee', age: 61, gender: 'Male', phone: '(555) 789-0123', email: 'george.l@email.com', lastVisit: '2026-01-18', totalVisits: 20, status: 'Inactive' }
  ];

  ngOnInit() {
    this.filteredPatients = [...this.patients];
  }

  filterPatients() {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPatients = [...this.patients];
      return;
    }
    this.filteredPatients = this.patients.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term) ||
      p.phone.includes(term) ||
      p.gender.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  }

  getActiveCount() {
    return this.patients.filter(p => p.status === 'Active').length;
  }

  getInactiveCount() {
    return this.patients.filter(p => p.status === 'Inactive').length;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPatients.length / this.pageSize);
  }

  get paginatedPatients(): Patient[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPatients.slice(start, start + this.pageSize);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditing = false;
    this.editingPatientId = null;
    this.newPatient = {
      name: '',
      age: undefined,
      gender: undefined,
      phone: '',
      email: '',
      status: 'Active'
    };
  }

  editPatient(patient: Patient) {
    this.isEditing = true;
    this.editingPatientId = patient.id;
    this.newPatient = { ...patient };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  deletePatient(id: number) {
    this.patients = this.patients.filter(p => p.id !== id);
    this.filterPatients();
  }

  savePatient() {
    if (this.newPatient.name && this.newPatient.age && this.newPatient.gender && this.newPatient.phone) {
      if (this.isEditing && this.editingPatientId) {
        const index = this.patients.findIndex(p => p.id === this.editingPatientId);
        if (index > -1) {
          this.patients[index] = { ...this.patients[index], ...this.newPatient } as Patient;
        }
      } else {
        const nextId = Math.max(...this.patients.map(p => p.id)) + 1;
        this.patients.unshift({
          id: nextId,
          name: this.newPatient.name!,
          age: this.newPatient.age!,
          gender: this.newPatient.gender!,
          phone: this.newPatient.phone!,
          email: this.newPatient.email || '',
          lastVisit: new Date().toISOString().split('T')[0],
          totalVisits: 0,
          status: this.newPatient.status || 'Active'
        });
      }
      this.filterPatients();
      this.closeModal();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
