import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { CustomPaginatorIntl } from './utils/custom-paginator-intl';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { PatientListComponent } from './components/patient-list/patient-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientListComponent,
    PatientDetailsComponent,
  ],
  imports: [
    QRCodeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule, 
     MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
