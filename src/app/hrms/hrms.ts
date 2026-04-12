import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: 'Front Desk' | 'Clinical' | 'Lab' | 'Administration' | 'Housekeeping';
  phone: string;
  email: string;
  joinDate: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
}

@Component({
  selector: 'app-hrms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hrms.html',
  styleUrl: './hrms.css'
})
export class Hrms implements OnInit {
  isModalOpen = false;
  isEditing = false;
  isViewMode = false;
  editingEmployeeId: number | null = null;
  searchTerm = '';
  filteredEmployees: Employee[] = [];
  currentPage = 1;
  pageSize = 5;

  newEmployee: Partial<Employee> = {
    name: '',
    role: '',
    department: undefined,
    phone: '',
    email: '',
    salary: undefined,
    status: 'Active'
  };

  employees: Employee[] = [
    { id: 2001, name: 'Sarah Mitchell', role: 'Receptionist', department: 'Front Desk', phone: '(555) 101-2001', email: 'sarah.m@dentalcare.com', joinDate: '2023-06-15', salary: 35000, status: 'Active' },
    { id: 2002, name: 'James Carter', role: 'Dental Hygienist', department: 'Clinical', phone: '(555) 101-2002', email: 'james.c@dentalcare.com', joinDate: '2022-01-10', salary: 62000, status: 'Active' },
    { id: 2003, name: 'Emily Davis', role: 'Lab Technician', department: 'Lab', phone: '(555) 101-2003', email: 'emily.d@dentalcare.com', joinDate: '2024-03-22', salary: 48000, status: 'Active' },
    { id: 2004, name: 'Michael Brown', role: 'Office Manager', department: 'Administration', phone: '(555) 101-2004', email: 'michael.b@dentalcare.com', joinDate: '2021-08-01', salary: 55000, status: 'Active' },
    { id: 2005, name: 'Lisa Rodriguez', role: 'Dental Assistant', department: 'Clinical', phone: '(555) 101-2005', email: 'lisa.r@dentalcare.com', joinDate: '2023-11-05', salary: 42000, status: 'On Leave' },
    { id: 2006, name: 'David Kim', role: 'IT Support', department: 'Administration', phone: '(555) 101-2006', email: 'david.k@dentalcare.com', joinDate: '2024-07-18', salary: 50000, status: 'Active' },
    { id: 2007, name: 'Rachel Green', role: 'Billing Specialist', department: 'Administration', phone: '(555) 101-2007', email: 'rachel.g@dentalcare.com', joinDate: '2022-05-30', salary: 45000, status: 'Active' },
    { id: 2008, name: 'Tom Harris', role: 'Janitor', department: 'Housekeeping', phone: '(555) 101-2008', email: 'tom.h@dentalcare.com', joinDate: '2025-01-12', salary: 28000, status: 'Terminated' },
    { id: 2009, name: 'Anna Wilson', role: 'Dental Nurse', department: 'Clinical', phone: '(555) 101-2009', email: 'anna.w@dentalcare.com', joinDate: '2023-09-20', salary: 52000, status: 'Active' },
    { id: 2010, name: 'Kevin Patel', role: 'Sterilization Tech', department: 'Lab', phone: '(555) 101-2010', email: 'kevin.p@dentalcare.com', joinDate: '2024-11-01', salary: 38000, status: 'Active' }
  ];

  ngOnInit() {
    this.filteredEmployees = [...this.employees];
  }

  filterEmployees() {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredEmployees = [...this.employees];
      return;
    }
    this.filteredEmployees = this.employees.filter(e =>
      e.name.toLowerCase().includes(term) ||
      e.role.toLowerCase().includes(term) ||
      e.department.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term) ||
      e.phone.includes(term) ||
      e.status.toLowerCase().includes(term)
    );
  }

  getActiveCount() {
    return this.employees.filter(e => e.status === 'Active').length;
  }

  getOnLeaveCount() {
    return this.employees.filter(e => e.status === 'On Leave').length;
  }

  getTerminatedCount() {
    return this.employees.filter(e => e.status === 'Terminated').length;
  }

  getTotalSalary() {
    return this.employees.filter(e => e.status === 'Active').reduce((sum, e) => sum + e.salary, 0);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

  get paginatedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
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
    this.editingEmployeeId = null;
    this.newEmployee = {
      name: '',
      role: '',
      department: undefined,
      phone: '',
      email: '',
      salary: undefined,
      status: 'Active'
    };
  }

  viewEmployee(employee: Employee) {
    this.isViewMode = true;
    this.isEditing = false;
    this.newEmployee = { ...employee };
    this.isModalOpen = true;
  }

  editEmployee(employee: Employee) {
    this.isEditing = true;
    this.isViewMode = false;
    this.editingEmployeeId = employee.id;
    this.newEmployee = { ...employee };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isViewMode = false;
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(e => e.id !== id);
    this.filterEmployees();
  }

  saveEmployee() {
    if (this.newEmployee.name && this.newEmployee.role && this.newEmployee.department && this.newEmployee.phone) {
      if (this.isEditing && this.editingEmployeeId) {
        const index = this.employees.findIndex(e => e.id === this.editingEmployeeId);
        if (index > -1) {
          this.employees[index] = { ...this.employees[index], ...this.newEmployee } as Employee;
        }
      } else {
        const nextId = Math.max(...this.employees.map(e => e.id)) + 1;
        this.employees.unshift({
          id: nextId,
          name: this.newEmployee.name!,
          role: this.newEmployee.role!,
          department: this.newEmployee.department!,
          phone: this.newEmployee.phone!,
          email: this.newEmployee.email || '',
          joinDate: new Date().toISOString().split('T')[0],
          salary: this.newEmployee.salary || 0,
          status: this.newEmployee.status || 'Active'
        });
      }
      this.filterEmployees();
      this.closeModal();
    } else {
      alert('Please fill out all required fields.');
    }
  }

  getDepartmentIcon(department: string): string {
    const icons: Record<string, string> = {
      'Front Desk': 'fa-solid fa-bell-concierge',
      'Clinical': 'fa-solid fa-stethoscope',
      'Lab': 'fa-solid fa-flask',
      'Administration': 'fa-solid fa-briefcase',
      'Housekeeping': 'fa-solid fa-broom'
    };
    return icons[department] || 'fa-solid fa-building';
  }
}
