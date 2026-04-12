import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Prescription {
  id: number;
  patientName: string;
  doctor: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  notes: string;
  status: 'Active' | 'Completed' | 'Cancelled';
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.css'
})
export class Prescriptions implements OnInit {
  isModalOpen = false;
  isEditing = false;
  isViewMode = false;
  editingPrescriptionId: number | null = null;
  searchTerm = '';
  filteredPrescriptions: Prescription[] = [];
  currentPage = 1;
  pageSize = 3;
  viewPrescription: Prescription | null = null;

  newPrescription: Partial<Prescription> = {
    patientName: '',
    doctor: '',
    date: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    notes: '',
    status: 'Active'
  };

  prescriptions: Prescription[] = [
    {
      id: 5001, patientName: 'Alice Johnson', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-28',
      diagnosis: 'Tooth Sensitivity',
      medications: [
        { name: 'Sensodyne Toothpaste', dosage: 'Apply twice', frequency: 'Twice daily', duration: '4 weeks' },
        { name: 'Ibuprofen 200mg', dosage: '1 tablet', frequency: 'As needed', duration: '5 days' }
      ],
      notes: 'Avoid very hot or cold foods for 2 weeks.',
      status: 'Active'
    },
    {
      id: 5002, patientName: 'Bob Williams', doctor: 'Dr. Davis (General)', date: '2026-03-27',
      diagnosis: 'Gum Inflammation',
      medications: [
        { name: 'Chlorhexidine Mouthwash', dosage: '10ml', frequency: 'Twice daily', duration: '2 weeks' },
        { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: '3 times daily', duration: '7 days' }
      ],
      notes: 'Follow up in 2 weeks. Maintain oral hygiene.',
      status: 'Active'
    },
    {
      id: 5003, patientName: 'Charlie Brown', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-20',
      diagnosis: 'Post Extraction Care',
      medications: [
        { name: 'Ibuprofen 400mg', dosage: '1 tablet', frequency: 'Every 6 hours', duration: '3 days' },
        { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: '3 times daily', duration: '5 days' }
      ],
      notes: 'No smoking or using straws for 48 hours.',
      status: 'Completed'
    },
    {
      id: 5004, patientName: 'Diana Prince', doctor: 'Dr. Evans (Surgeon)', date: '2026-03-25',
      diagnosis: 'Post Implant Recovery',
      medications: [
        { name: 'Metronidazole 400mg', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days' },
        { name: 'Paracetamol 500mg', dosage: '2 tablets', frequency: 'Every 8 hours', duration: '3 days' }
      ],
      notes: 'Soft diet for 1 week. Follow up in 10 days.',
      status: 'Active'
    },
    {
      id: 5005, patientName: 'Evan Wright', doctor: 'Dr. Davis (General)', date: '2026-03-15',
      diagnosis: 'Dental Caries',
      medications: [
        { name: 'Fluoride Gel', dosage: 'Apply once', frequency: 'Daily', duration: '3 weeks' }
      ],
      notes: 'Reduce sugar intake. Schedule follow-up filling.',
      status: 'Cancelled'
    }
  ];

  ngOnInit() {
    this.filteredPrescriptions = [...this.prescriptions];
  }

  filterPrescriptions() {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPrescriptions = [...this.prescriptions];
      return;
    }
    this.filteredPrescriptions = this.prescriptions.filter(p =>
      p.patientName.toLowerCase().includes(term) ||
      p.doctor.toLowerCase().includes(term) ||
      p.diagnosis.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term) ||
      p.medications.some(m => m.name.toLowerCase().includes(term))
    );
  }

  getActiveCount() {
    return this.prescriptions.filter(p => p.status === 'Active').length;
  }

  getCompletedCount() {
    return this.prescriptions.filter(p => p.status === 'Completed').length;
  }

  getCancelledCount() {
    return this.prescriptions.filter(p => p.status === 'Cancelled').length;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPrescriptions.length / this.pageSize);
  }

  get paginatedPrescriptions(): Prescription[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPrescriptions.slice(start, start + this.pageSize);
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
    this.isViewMode = false;
    this.editingPrescriptionId = null;
    this.newPrescription = {
      patientName: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      diagnosis: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      notes: '',
      status: 'Active'
    };
  }

  viewDetails(prescription: Prescription) {
    this.viewPrescription = prescription;
    this.isViewMode = true;
    this.isModalOpen = true;
    this.isEditing = false;
  }

  editPrescription(prescription: Prescription) {
    this.isEditing = true;
    this.isViewMode = false;
    this.editingPrescriptionId = prescription.id;
    this.newPrescription = {
      ...prescription,
      medications: prescription.medications.map(m => ({ ...m }))
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isViewMode = false;
    this.viewPrescription = null;
  }

  addMedication() {
    if (!this.newPrescription.medications) {
      this.newPrescription.medications = [];
    }
    this.newPrescription.medications.push({ name: '', dosage: '', frequency: '', duration: '' });
  }

  removeMedication(index: number) {
    this.newPrescription.medications?.splice(index, 1);
  }

  updateStatus(id: number, status: 'Active' | 'Completed' | 'Cancelled') {
    const p = this.prescriptions.find(rx => rx.id === id);
    if (p) {
      p.status = status;
      this.filterPrescriptions();
    }
  }

  savePrescription() {
    if (this.newPrescription.patientName && this.newPrescription.doctor && this.newPrescription.diagnosis && this.newPrescription.medications?.length) {
      if (this.isEditing && this.editingPrescriptionId) {
        const index = this.prescriptions.findIndex(p => p.id === this.editingPrescriptionId);
        if (index > -1) {
          this.prescriptions[index] = { ...this.prescriptions[index], ...this.newPrescription } as Prescription;
        }
      } else {
        const nextId = Math.max(...this.prescriptions.map(p => p.id)) + 1;
        this.prescriptions.unshift({
          id: nextId,
          patientName: this.newPrescription.patientName!,
          doctor: this.newPrescription.doctor!,
          date: this.newPrescription.date || new Date().toISOString().split('T')[0],
          diagnosis: this.newPrescription.diagnosis!,
          medications: this.newPrescription.medications!,
          notes: this.newPrescription.notes || '',
          status: 'Active'
        });
      }
      this.filterPrescriptions();
      this.closeModal();
    } else {
      alert('Please fill out all required fields and add at least one medication.');
    }
  }
}
