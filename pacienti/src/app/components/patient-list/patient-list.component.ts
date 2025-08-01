import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PatientInfo } from '../../models/patient.model';
import { DALService } from '../../services/DAL.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss'],
})
export class PatientListComponent implements OnInit {
  @Output() selectPatient = new EventEmitter<PatientInfo>();
  @Output() editPatientEvent = new EventEmitter<PatientInfo>();
  @Output() deletePatientEvent = new EventEmitter<string>();

  selectedPatientId: string | null = null;
  dataSource = new MatTableDataSource<PatientInfo>();
  searchTerm: string = '';
  qrVisible = false;
  qrValue = '';

  columnDefinitions = [
    { def: 'family', label: 'Nume', visible: true },
    { def: 'given', label: 'Prenume', visible: true },
    { def: 'age', label: 'Vârstă', visible: false },
    { def: 'gender', label: 'Sex', visible: true },
    { def: 'identifier', label: 'CNP', visible: false },
    { def: 'phones', label: 'Telefon', visible: false },
    { def: 'actions', label: 'Acțiuni', visible: true },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dalService: DALService) {}

  ngOnInit(): void {
    this.loadPatients();
    this.dataSource.filterPredicate = this.customFilter.bind(this);
    this.dataSource.sortingDataAccessor = this.customSorting.bind(this);
  }

  getDisplayedColumns(): string[] {
    return this.columnDefinitions
      .filter((col) => col.visible)
      .map((col) => col.def);
  }

  async loadPatients() {
    const patients = await this.dalService.getPatients({});
    this.dataSource.data = patients.reverse();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  async deletePatient(id: string) {
    if (confirm('Sunteți sigur că doriți să ștergeți pacientul?')) {
      await this.dalService.deletePatients(id);
      this.loadPatients();
       this.deletePatientEvent.emit(id);
    }

  }

  async editPatient(id: string) {
    const patient = await this.dalService.getPatient(id);
    this.selectedPatientId = id;
    this.editPatientEvent.emit(patient);
  }

  onSelect(patient: PatientInfo) {
    this.selectPatient.emit(patient);
  }

  formatAge(birthDate?: string): string {
    if (!birthDate) return '';

    const dateOfBirth = new Date(birthDate);
    if (isNaN(dateOfBirth.getTime())) return '';

    const today = new Date();
    let years = today.getFullYear() - dateOfBirth.getFullYear();

    const notYetBirthday =
      today.getMonth() < dateOfBirth.getMonth() ||
      (today.getMonth() === dateOfBirth.getMonth() &&
        today.getDate() < dateOfBirth.getDate());

    if (notYetBirthday) {
      years--;
    }

    return years > 0 ? `${years} ani` : '';
  }

  showQr(patient: PatientInfo) {
    const id = patient.id;
    const cnp = patient.identifier?.slice(7, 12) ?? '????';
    const gender = (patient.gender ?? '').toUpperCase();
    this.qrValue = `https://example.com/${id}|${cnp}|${gender}`;
    this.qrVisible = true;
  }

  closeQr() {
    this.qrVisible = false;
  }

  customFilter(data: PatientInfo, filter: string): boolean {
    const term = filter.trim().toLowerCase();
    const family = data.name?.family?.toLowerCase() || '';
    const given = data.name?.given?.toLowerCase() || '';
    const cnp = data.identifier?.toLowerCase() || '';
    return family.includes(term) || given.includes(term) || cnp.includes(term);
  }

  customSorting(patient: PatientInfo, property: string): string | number {
    switch (property) {
      case 'family':
        return patient.name?.family?.toLowerCase() || '';

      case 'given':
        return patient.name?.given?.toLowerCase() || '';

      case 'age':
        return this.getAgeValue(patient.birthDate);

      default:
        return (patient as any)[property];
    }
  }

  formatPhones(phones?: { label: string; number: string }[]): string {
    return phones?.length
      ? phones.map((p) => `${p.label}: ${p.number}`).join(', ')
      : 'fără telefon';
  }

  getAgeValue(birthDate?: string): number {
    const d = birthDate ? new Date(birthDate) : null;
    if (!d) return -1;
    const today = new Date();
    const age = today.getFullYear() - d.getFullYear();
    return today < new Date(today.getFullYear(), d.getMonth(), d.getDate())
      ? age - 1
      : age;
  }
}
