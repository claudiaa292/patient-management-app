import { Component, ViewChild } from '@angular/core';
import { PatientInfo } from './models/patient.model';
import { DALService } from './services/DAL.service';
import { PatientListComponent } from './components/patient-list/patient-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  selectedPatient: PatientInfo | undefined = undefined;
  mode: 'view' | 'edit' | 'add' = 'view';
  @ViewChild(PatientListComponent) patientListComponent!: PatientListComponent;

  constructor(private DALService: DALService) {}

  selectPatient(patient: PatientInfo): void {
    this.selectedPatient = patient;
    this.mode = 'view';
  }

  addPatient(): void {
    this.selectedPatient = {
      id: '',
      name: {
        family: '',
        given: '',
        prefix: [''],
      },
      identifier: '',
      birthDate: '',
      gender: '',
      phones: [],
      addresses: [
        {
          use: 'home',
          street: '',
          number: '',
          block: '',
          floor: '',
          apartment: '',
          district: '',
          city: '',
        },
        {
          use: 'temp',
          street: '',
          number: '',
          block: '',
          floor: '',
          apartment: '',
          district: '',
          city: '',
        },
      ],
      note: '',
    };
    this.mode = 'add';
  }

  editPatient(patient: PatientInfo): void {
    this.selectedPatient = patient;
    this.mode = 'edit';
  }

  cancelEditMode(): void {
    this.mode = 'view';
  }

  refreshList(): void {
    if (this.patientListComponent) {
      this.patientListComponent.loadPatients();
    }
  }

  public async savePatient(patient: PatientInfo) {
    if (this.mode === 'add') {
      const addedPatient = await this.DALService.setPatient(patient);
      this.selectedPatient = addedPatient;
      this.refreshList();
    } else if (this.mode === 'edit') {
      const updatedPacient = await this.DALService.setPatient(patient);
      this.selectedPatient = updatedPacient;
      this.refreshList();
    }
    this.mode = 'view';
  }
}
