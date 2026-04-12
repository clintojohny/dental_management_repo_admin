import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RecordFile {
  name: string;
  type: string;
  date: string;
}

interface MedicalRecord {
  id: number;
  patientName: string;
  patientId: number;
  doctor: string;
  date: string;
  type: 'Treatment' | 'Diagnosis' | 'Lab Report' | 'X-Ray' | 'Follow-Up' | 'Surgery';
  title: string;
  description: string;
  findings: string;
  treatmentDone: string;
  files: RecordFile[];
  notes: string;
  status: 'Completed' | 'In Progress' | 'Pending Review';
}

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './records.html',
  styleUrl: './records.css'
})
export class Records implements OnInit {
  isModalOpen = false;
  isEditing = false;
  isViewMode = false;
  editingRecordId: number | null = null;
  searchTerm = '';
  selectedType = '';
  filteredRecords: MedicalRecord[] = [];
  currentPage = 1;
  pageSize = 3;
  viewRecord: MedicalRecord | null = null;

  recordTypes = ['Treatment', 'Diagnosis', 'Lab Report', 'X-Ray', 'Follow-Up', 'Surgery'];

  newRecord: Partial<MedicalRecord> = {
    patientName: '',
    patientId: undefined,
    doctor: '',
    date: '',
    type: undefined,
    title: '',
    description: '',
    findings: '',
    treatmentDone: '',
    files: [],
    notes: '',
    status: 'Completed'
  };

  records: MedicalRecord[] = [
    {
      id: 7001, patientName: 'Alice Johnson', patientId: 1001, doctor: 'Dr. Robert Smith',
      date: '2026-03-28', type: 'Treatment', title: 'Braces Adjustment - Session 4',
      description: 'Regular orthodontic adjustment for upper and lower braces.',
      findings: 'Teeth alignment progressing well. Minor crowding still present on lower left.',
      treatmentDone: 'Archwire replaced, elastic bands adjusted. Power chain applied on lower left.',
      files: [
        { name: 'xray-alice-20260328.jpg', type: 'X-Ray', date: '2026-03-28' },
        { name: 'progress-photo-front.jpg', type: 'Photo', date: '2026-03-28' }
      ],
      notes: 'Next appointment in 6 weeks. Patient advised to maintain elastic wear 22hrs/day.',
      status: 'Completed'
    },
    {
      id: 7002, patientName: 'Bob Williams', patientId: 1002, doctor: 'Dr. Sarah Davis',
      date: '2026-03-27', type: 'Diagnosis', title: 'Gum Disease Assessment',
      description: 'Patient presented with bleeding gums and mild pain during brushing.',
      findings: 'Moderate gingivitis detected. Plaque buildup in lower anterior region. No bone loss on X-ray.',
      treatmentDone: 'Professional scaling and polishing done. Chlorhexidine mouthwash prescribed.',
      files: [
        { name: 'periodontal-chart-bob.pdf', type: 'Chart', date: '2026-03-27' }
      ],
      notes: 'Review in 2 weeks. Referred for deep cleaning if no improvement.',
      status: 'Completed'
    },
    {
      id: 7003, patientName: 'Charlie Brown', patientId: 1003, doctor: 'Dr. Robert Smith',
      date: '2026-03-20', type: 'Surgery', title: 'Wisdom Tooth Extraction (#38)',
      description: 'Surgical extraction of impacted lower left third molar.',
      findings: 'Horizontally impacted wisdom tooth. Adjacent tooth (#37) unaffected.',
      treatmentDone: 'Surgical extraction under local anesthesia. 3 sutures placed. Hemostasis achieved.',
      files: [
        { name: 'opg-charlie-pre-op.jpg', type: 'X-Ray', date: '2026-03-20' },
        { name: 'consent-form-signed.pdf', type: 'Document', date: '2026-03-20' },
        { name: 'opg-charlie-post-op.jpg', type: 'X-Ray', date: '2026-03-20' }
      ],
      notes: 'Suture removal in 7 days. Soft diet for 3 days. Antibiotics and painkillers prescribed.',
      status: 'Completed'
    },
    {
      id: 7004, patientName: 'Diana Prince', patientId: 1004, doctor: 'Dr. Michael Evans',
      date: '2026-03-25', type: 'Treatment', title: 'Dental Implant - Stage 1',
      description: 'Implant placement for missing upper right first molar (#16).',
      findings: 'Adequate bone density confirmed via CT scan. Ridge suitable for standard implant.',
      treatmentDone: 'Straumann BLT implant (4.1x10mm) placed. Cover screw applied. Primary stability achieved.',
      files: [
        { name: 'ct-scan-diana.pdf', type: 'CT Scan', date: '2026-03-24' },
        { name: 'implant-placement-photo.jpg', type: 'Photo', date: '2026-03-25' }
      ],
      notes: 'Osseointegration period: 3 months. Stage 2 surgery scheduled for June 2026.',
      status: 'In Progress'
    },
    {
      id: 7005, patientName: 'Evan Wright', patientId: 1005, doctor: 'Dr. Sarah Davis',
      date: '2026-03-15', type: 'Lab Report', title: 'Oral Pathology Report',
      description: 'Biopsy of suspicious lesion on left buccal mucosa.',
      findings: 'Histopathology report: Benign fibroma. No signs of malignancy.',
      treatmentDone: 'Excisional biopsy performed. Specimen sent to lab.',
      files: [
        { name: 'pathology-report-evan.pdf', type: 'Lab Report', date: '2026-03-18' },
        { name: 'clinical-photo-lesion.jpg', type: 'Photo', date: '2026-03-15' }
      ],
      notes: 'Patient reassured. Follow-up in 6 months to monitor site.',
      status: 'Completed'
    },
    {
      id: 7006, patientName: 'Fiona Garcia', patientId: 1006, doctor: 'Dr. Sarah Davis',
      date: '2026-03-27', type: 'X-Ray', title: 'Full Mouth X-Ray Series',
      description: 'Complete periapical and bitewing radiograph series for comprehensive evaluation.',
      findings: 'Caries detected on #14 (mesial), #36 (occlusal). Root canal treated #46 shows adequate obturation.',
      treatmentDone: 'Radiographs taken and reviewed.',
      files: [
        { name: 'fmx-fiona-complete.pdf', type: 'X-Ray', date: '2026-03-27' }
      ],
      notes: 'Treatment plan: Composite fillings on #14 and #36. Schedule 2 appointments.',
      status: 'Pending Review'
    },
    {
      id: 7007, patientName: 'Alice Johnson', patientId: 1001, doctor: 'Dr. Robert Smith',
      date: '2026-02-14', type: 'Follow-Up', title: 'Braces Progress Check',
      description: 'Routine follow-up to assess orthodontic treatment progress.',
      findings: 'Good progress. Upper midline corrected. Lower arch still requires alignment.',
      treatmentDone: 'No adjustments made. Photos taken for comparison.',
      files: [
        { name: 'progress-photos-feb.zip', type: 'Photo', date: '2026-02-14' }
      ],
      notes: 'Treatment on track. Estimated remaining time: 8 months.',
      status: 'Completed'
    }
  ];

  ngOnInit() {
    this.filteredRecords = [...this.records];
  }

  filterRecords() {
    this.currentPage = 1;
    let results = [...this.records];
    const term = this.searchTerm.toLowerCase().trim();

    if (term) {
      results = results.filter(r =>
        r.patientName.toLowerCase().includes(term) ||
        r.doctor.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term) ||
        r.type.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term) ||
        r.findings.toLowerCase().includes(term)
      );
    }

    if (this.selectedType) {
      results = results.filter(r => r.type === this.selectedType);
    }

    this.filteredRecords = results;
  }

  getTypeCount(type: string) {
    return this.records.filter(r => r.type === type).length;
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'Treatment': 'fa-solid fa-tooth',
      'Diagnosis': 'fa-solid fa-stethoscope',
      'Lab Report': 'fa-solid fa-flask',
      'X-Ray': 'fa-solid fa-x-ray',
      'Follow-Up': 'fa-solid fa-rotate',
      'Surgery': 'fa-solid fa-scissors'
    };
    return icons[type] || 'fa-solid fa-file-medical';
  }

  getFileIcon(type: string): string {
    const icons: Record<string, string> = {
      'X-Ray': 'fa-solid fa-x-ray',
      'CT Scan': 'fa-solid fa-x-ray',
      'Photo': 'fa-regular fa-image',
      'Chart': 'fa-solid fa-chart-line',
      'Document': 'fa-regular fa-file-pdf',
      'Lab Report': 'fa-solid fa-flask'
    };
    return icons[type] || 'fa-regular fa-file';
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.pageSize);
  }

  get paginatedRecords(): MedicalRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecords.slice(start, start + this.pageSize);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  viewDetails(record: MedicalRecord) {
    this.viewRecord = record;
    this.isViewMode = true;
    this.isModalOpen = true;
    this.isEditing = false;
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditing = false;
    this.isViewMode = false;
    this.editingRecordId = null;
    this.newRecord = {
      patientName: '',
      patientId: undefined,
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      type: undefined,
      title: '',
      description: '',
      findings: '',
      treatmentDone: '',
      files: [],
      notes: '',
      status: 'Completed'
    };
  }

  editRecord(record: MedicalRecord) {
    this.isEditing = true;
    this.isViewMode = false;
    this.editingRecordId = record.id;
    this.newRecord = {
      ...record,
      files: record.files.map(f => ({ ...f }))
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isViewMode = false;
    this.viewRecord = null;
  }

  deleteRecord(id: number) {
    this.records = this.records.filter(r => r.id !== id);
    this.filterRecords();
  }

  saveRecord() {
    if (this.newRecord.patientName && this.newRecord.doctor && this.newRecord.title && this.newRecord.type) {
      if (this.isEditing && this.editingRecordId) {
        const index = this.records.findIndex(r => r.id === this.editingRecordId);
        if (index > -1) {
          this.records[index] = { ...this.records[index], ...this.newRecord } as MedicalRecord;
        }
      } else {
        const nextId = Math.max(...this.records.map(r => r.id)) + 1;
        this.records.unshift({
          id: nextId,
          patientName: this.newRecord.patientName!,
          patientId: this.newRecord.patientId || 0,
          doctor: this.newRecord.doctor!,
          date: this.newRecord.date || new Date().toISOString().split('T')[0],
          type: this.newRecord.type! as MedicalRecord['type'],
          title: this.newRecord.title!,
          description: this.newRecord.description || '',
          findings: this.newRecord.findings || '',
          treatmentDone: this.newRecord.treatmentDone || '',
          files: this.newRecord.files || [],
          notes: this.newRecord.notes || '',
          status: this.newRecord.status as MedicalRecord['status'] || 'Completed'
        });
      }
      this.filterRecords();
      this.closeModal();
    } else {
      alert('Please fill out all required fields.');
    }
  }
}
