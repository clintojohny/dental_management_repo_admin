import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  phone: string;
  email: string;
  avatar: string;
  availability: string[];
  consultationFee: number;
  patientsHandled: number;
  rating: number;
  status: 'Available' | 'On Leave' | 'Busy';
}

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css'
})
export class Doctors implements OnInit {
  isModalOpen = false;
  isEditing = false;
  isViewMode = false;
  editingDoctorId: number | null = null;
  searchTerm = '';
  filteredDoctors: Doctor[] = [];
  viewDoctor: Doctor | null = null;

  newDoctor: Partial<Doctor> = {
    name: '',
    specialization: '',
    qualification: '',
    experience: undefined,
    phone: '',
    email: '',
    avatar: '',
    availability: [],
    consultationFee: undefined,
    status: 'Available'
  };

  availabilityDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  doctors: Doctor[] = [
    {
      id: 201, name: 'Dr. Robert Smith', specialization: 'Orthodontist', qualification: 'BDS, MDS - Orthodontics',
      experience: 12, phone: '(555) 100-2001', email: 'dr.smith@dentalcare.com',
      avatar: 'https://i.pravatar.cc/150?img=68',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      consultationFee: 500, patientsHandled: 1250, rating: 4.8, status: 'Available'
    },
    {
      id: 202, name: 'Dr. Sarah Davis', specialization: 'General Dentist', qualification: 'BDS, MPH',
      experience: 8, phone: '(555) 100-2002', email: 'dr.davis@dentalcare.com',
      avatar: 'https://i.pravatar.cc/150?img=47',
      availability: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      consultationFee: 350, patientsHandled: 980, rating: 4.6, status: 'Available'
    },
    {
      id: 203, name: 'Dr. Michael Evans', specialization: 'Oral Surgeon', qualification: 'BDS, MDS - Oral Surgery, FDSRCS',
      experience: 18, phone: '(555) 100-2003', email: 'dr.evans@dentalcare.com',
      avatar: 'https://i.pravatar.cc/150?img=60',
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      consultationFee: 800, patientsHandled: 2100, rating: 4.9, status: 'Busy'
    },
    {
      id: 204, name: 'Dr. Emily Chen', specialization: 'Pediatric Dentist', qualification: 'BDS, MDS - Pedodontics',
      experience: 6, phone: '(555) 100-2004', email: 'dr.chen@dentalcare.com',
      avatar: 'https://i.pravatar.cc/150?img=45',
      availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      consultationFee: 400, patientsHandled: 650, rating: 4.7, status: 'Available'
    },
    {
      id: 205, name: 'Dr. James Wilson', specialization: 'Endodontist', qualification: 'BDS, MDS - Conservative Dentistry',
      experience: 15, phone: '(555) 100-2005', email: 'dr.wilson@dentalcare.com',
      avatar: 'https://i.pravatar.cc/150?img=53',
      availability: ['Monday', 'Wednesday', 'Friday'],
      consultationFee: 600, patientsHandled: 1800, rating: 4.5, status: 'On Leave'
    },
    {
      id: 206, name: 'Dr. Priya Sharma', specialization: 'Prosthodontist', qualification: 'BDS, MDS - Prosthodontics',
      experience: 10, phone: '(555) 100-2006', email: 'dr.sharma@dentalcare.com',
      avatar: 'https://i.pravatar.cc/150?img=44',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      consultationFee: 550, patientsHandled: 1100, rating: 4.8, status: 'Available'
    }
  ];

  ngOnInit() {
    this.filteredDoctors = [...this.doctors];
  }

  filterDoctors() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredDoctors = [...this.doctors];
      return;
    }
    this.filteredDoctors = this.doctors.filter(d =>
      d.name.toLowerCase().includes(term) ||
      d.specialization.toLowerCase().includes(term) ||
      d.qualification.toLowerCase().includes(term) ||
      d.status.toLowerCase().includes(term) ||
      d.email.toLowerCase().includes(term)
    );
  }

  getAvailableCount() {
    return this.doctors.filter(d => d.status === 'Available').length;
  }

  getBusyCount() {
    return this.doctors.filter(d => d.status === 'Busy').length;
  }

  getOnLeaveCount() {
    return this.doctors.filter(d => d.status === 'On Leave').length;
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.round(rating) ? 1 : 0);
  }

  viewDetails(doctor: Doctor) {
    this.viewDoctor = doctor;
    this.isViewMode = true;
    this.isModalOpen = true;
    this.isEditing = false;
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditing = false;
    this.isViewMode = false;
    this.editingDoctorId = null;
    this.newDoctor = {
      name: '',
      specialization: '',
      qualification: '',
      experience: undefined,
      phone: '',
      email: '',
      avatar: '',
      availability: [],
      consultationFee: undefined,
      status: 'Available'
    };
  }

  editDoctor(doctor: Doctor) {
    this.isEditing = true;
    this.isViewMode = false;
    this.editingDoctorId = doctor.id;
    this.newDoctor = { ...doctor, availability: [...doctor.availability] };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isViewMode = false;
    this.viewDoctor = null;
  }

  toggleAvailability(day: string) {
    if (!this.newDoctor.availability) {
      this.newDoctor.availability = [];
    }
    const index = this.newDoctor.availability.indexOf(day);
    if (index > -1) {
      this.newDoctor.availability.splice(index, 1);
    } else {
      this.newDoctor.availability.push(day);
    }
  }

  isDaySelected(day: string): boolean {
    return this.newDoctor.availability?.includes(day) || false;
  }

  deleteDoctor(id: number) {
    this.doctors = this.doctors.filter(d => d.id !== id);
    this.filterDoctors();
  }

  saveDoctor() {
    if (this.newDoctor.name && this.newDoctor.specialization && this.newDoctor.phone) {
      if (this.isEditing && this.editingDoctorId) {
        const index = this.doctors.findIndex(d => d.id === this.editingDoctorId);
        if (index > -1) {
          this.doctors[index] = { ...this.doctors[index], ...this.newDoctor } as Doctor;
        }
      } else {
        const nextId = Math.max(...this.doctors.map(d => d.id)) + 1;
        this.doctors.unshift({
          id: nextId,
          name: this.newDoctor.name!,
          specialization: this.newDoctor.specialization!,
          qualification: this.newDoctor.qualification || '',
          experience: this.newDoctor.experience || 0,
          phone: this.newDoctor.phone!,
          email: this.newDoctor.email || '',
          avatar: this.newDoctor.avatar || `https://i.pravatar.cc/150?img=${nextId}`,
          availability: this.newDoctor.availability || [],
          consultationFee: this.newDoctor.consultationFee || 0,
          patientsHandled: 0,
          rating: 0,
          status: this.newDoctor.status || 'Available'
        });
      }
      this.filterDoctors();
      this.closeModal();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
