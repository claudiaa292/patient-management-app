import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { PatientInfo } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class DALService {
  API_URL = 'http://localhost:3000';
  PATIENT_URL = `${this.API_URL}/patients`;

  constructor(private http: HttpClient) {}

  public async getPatients(params: any): Promise<PatientInfo[]> {
    let result =
      (await this.http.get<PatientInfo[]>(`${this.PATIENT_URL}`).toPromise()) ??
      [];
    return result;
  }

  public async getPatient(id: string): Promise<PatientInfo | undefined> {
    return await this.http
      .get<PatientInfo | undefined>(`${this.PATIENT_URL}/${id}`)
      .toPromise();
  }

  public async setPatient(patient: PatientInfo) {
    if (patient.id) {
      return await this.http
        .put<PatientInfo>(`${this.PATIENT_URL}/${patient.id}`, patient)
        .toPromise();
    } else {
      patient.id = uuidv4();
      return await this.http
        .post<PatientInfo>(`${this.PATIENT_URL}`, patient)
        .toPromise();
    }
  }

  public async deletePatients(id: string): Promise<PatientInfo | undefined> {
    return await this.http.delete<any>(`${this.PATIENT_URL}/${id}`).toPromise();
  }
}
