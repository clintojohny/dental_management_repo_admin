import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: number;
  patientName: string;
  doctor: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  paidAmount: number;
  paymentMethod: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partial';
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css'
})
export class Billing implements OnInit {
  isModalOpen = false;
  isEditing = false;
  isViewMode = false;
  editingInvoiceId: number | null = null;
  searchTerm = '';
  filteredInvoices: Invoice[] = [];
  currentPage = 1;
  pageSize = 5;
  viewInvoice: Invoice | null = null;

  newInvoice: Partial<Invoice> = {
    patientName: '',
    doctor: '',
    date: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    paymentMethod: '',
    paidAmount: 0,
    status: 'Pending'
  };

  invoices: Invoice[] = [
    {
      id: 9001, patientName: 'Alice Johnson', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-28', dueDate: '2026-04-28',
      items: [
        { description: 'Braces Adjustment', quantity: 1, unitPrice: 250 },
        { description: 'X-Ray', quantity: 2, unitPrice: 75 }
      ],
      total: 400, paidAmount: 400, paymentMethod: 'Credit Card', status: 'Paid'
    },
    {
      id: 9002, patientName: 'Bob Williams', doctor: 'Dr. Davis (General)', date: '2026-03-27', dueDate: '2026-04-27',
      items: [
        { description: 'Teeth Cleaning', quantity: 1, unitPrice: 150 },
        { description: 'Fluoride Treatment', quantity: 1, unitPrice: 50 }
      ],
      total: 200, paidAmount: 0, paymentMethod: '', status: 'Pending'
    },
    {
      id: 9003, patientName: 'Charlie Brown', doctor: 'Dr. Smith (Orthodontist)', date: '2026-03-15', dueDate: '2026-03-25',
      items: [
        { description: 'Tooth Extraction', quantity: 1, unitPrice: 350 },
        { description: 'Anesthesia', quantity: 1, unitPrice: 100 },
        { description: 'Post-Op Medication', quantity: 1, unitPrice: 45 }
      ],
      total: 495, paidAmount: 0, paymentMethod: '', status: 'Overdue'
    },
    {
      id: 9004, patientName: 'Diana Prince', doctor: 'Dr. Evans (Surgeon)', date: '2026-03-25', dueDate: '2026-04-25',
      items: [
        { description: 'Dental Implant', quantity: 1, unitPrice: 2500 },
        { description: 'CT Scan', quantity: 1, unitPrice: 300 },
        { description: 'Follow-Up Consultation', quantity: 2, unitPrice: 100 }
      ],
      total: 3000, paidAmount: 1500, paymentMethod: 'Insurance', status: 'Partial'
    },
    {
      id: 9005, patientName: 'Evan Wright', doctor: 'Dr. Davis (General)', date: '2026-03-20', dueDate: '2026-04-20',
      items: [
        { description: 'Checkup', quantity: 1, unitPrice: 100 },
        { description: 'X-Ray', quantity: 1, unitPrice: 75 }
      ],
      total: 175, paidAmount: 175, paymentMethod: 'Cash', status: 'Paid'
    },
    {
      id: 9006, patientName: 'Fiona Garcia', doctor: 'Dr. Davis (General)', date: '2026-03-26', dueDate: '2026-04-26',
      items: [
        { description: 'Root Canal', quantity: 1, unitPrice: 800 },
        { description: 'Crown', quantity: 1, unitPrice: 600 }
      ],
      total: 1400, paidAmount: 700, paymentMethod: 'Credit Card', status: 'Partial'
    }
  ];

  ngOnInit() {
    this.filteredInvoices = [...this.invoices];
  }

  filterInvoices() {
    this.currentPage = 1;
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredInvoices = [...this.invoices];
      return;
    }
    this.filteredInvoices = this.invoices.filter(inv =>
      inv.patientName.toLowerCase().includes(term) ||
      inv.doctor.toLowerCase().includes(term) ||
      inv.status.toLowerCase().includes(term) ||
      inv.paymentMethod.toLowerCase().includes(term) ||
      inv.id.toString().includes(term)
    );
  }

  getTotalRevenue() {
    return this.invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  }

  getPendingAmount() {
    return this.invoices.reduce((sum, inv) => sum + (inv.total - inv.paidAmount), 0);
  }

  getPaidCount() {
    return this.invoices.filter(inv => inv.status === 'Paid').length;
  }

  getOverdueCount() {
    return this.invoices.filter(inv => inv.status === 'Overdue').length;
  }

  getBalance(inv: Invoice) {
    return inv.total - inv.paidAmount;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInvoices.length / this.pageSize);
  }

  get paginatedInvoices(): Invoice[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredInvoices.slice(start, start + this.pageSize);
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
    this.editingInvoiceId = null;
    this.newInvoice = {
      patientName: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      paymentMethod: '',
      paidAmount: 0,
      status: 'Pending'
    };
  }

  viewDetails(invoice: Invoice) {
    this.viewInvoice = invoice;
    this.isViewMode = true;
    this.isModalOpen = true;
    this.isEditing = false;
  }

  editInvoice(invoice: Invoice) {
    this.isEditing = true;
    this.isViewMode = false;
    this.editingInvoiceId = invoice.id;
    this.newInvoice = {
      ...invoice,
      items: invoice.items.map(item => ({ ...item }))
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isViewMode = false;
    this.viewInvoice = null;
  }

  addItem() {
    if (!this.newInvoice.items) {
      this.newInvoice.items = [];
    }
    this.newInvoice.items.push({ description: '', quantity: 1, unitPrice: 0 });
  }

  removeItem(index: number) {
    this.newInvoice.items?.splice(index, 1);
  }

  getItemsTotal(): number {
    return (this.newInvoice.items || []).reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  markAsPaid(id: number) {
    const inv = this.invoices.find(i => i.id === id);
    if (inv) {
      inv.paidAmount = inv.total;
      inv.status = 'Paid';
      this.filterInvoices();
    }
  }

  saveInvoice() {
    if (this.newInvoice.patientName && this.newInvoice.doctor && this.newInvoice.items?.length) {
      const total = (this.newInvoice.items || []).reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const paidAmount = this.newInvoice.paidAmount || 0;
      let status: Invoice['status'] = 'Pending';
      if (paidAmount >= total) status = 'Paid';
      else if (paidAmount > 0) status = 'Partial';

      if (this.isEditing && this.editingInvoiceId) {
        const index = this.invoices.findIndex(i => i.id === this.editingInvoiceId);
        if (index > -1) {
          this.invoices[index] = {
            ...this.invoices[index],
            ...this.newInvoice,
            total,
            status
          } as Invoice;
        }
      } else {
        const nextId = Math.max(...this.invoices.map(i => i.id)) + 1;
        this.invoices.unshift({
          id: nextId,
          patientName: this.newInvoice.patientName!,
          doctor: this.newInvoice.doctor!,
          date: this.newInvoice.date || new Date().toISOString().split('T')[0],
          dueDate: this.newInvoice.dueDate || '',
          items: this.newInvoice.items!,
          total,
          paidAmount,
          paymentMethod: this.newInvoice.paymentMethod || '',
          status
        });
      }
      this.filterInvoices();
      this.closeModal();
    } else {
      alert('Please fill out all required fields and add at least one item.');
    }
  }
}
