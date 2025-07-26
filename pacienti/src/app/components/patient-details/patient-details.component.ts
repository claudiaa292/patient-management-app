import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { PatientPhone, PatientInfo, PatientAddress } from '../..//models/patient.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  private _mode: 'view' | 'edit' | 'add' = 'view';
  private _patient: PatientInfo | undefined;
  sameAsHome: boolean = false;

  @Output() edit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<PatientInfo>();
  @Input() set mode(value: 'view' | 'edit' | 'add') {
    this._mode = value;
    if (this.form) {
      value === 'view' ? this.form.disable() : this.form.enable();
    }
  }

  get mode(): 'view' | 'edit' | 'add' {
    return this._mode;
  }

  get hasNamePairError(): boolean {
    return this.form.errors?.['namePairInvalid'] &&
      (this.form.get('family')?.touched || this.form.get('given')?.touched);
  }

  @Input() set patient(value: PatientInfo | undefined) {
    this._patient = value;
    if (this.form && value) {
      this.patchForm(value);
    }
  }

  get patient(): PatientInfo | undefined {
    return this._patient;
  }

  constructor(private fb: FormBuilder) { }

  form = this.fb.group({
    family: ['', [Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț\s\-]+$/)]],
    given: ['', [Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț\s\-]+$/)]],
    prefix: ['', [Validators.pattern(/^[A-Z]{1,3}$/)]],
    identifier: ['', [Validators.pattern(/^[1-8]\d{12}$/)]],
    birthDate: [''],
    gender: ['', Validators.required],
    note: [''],
    homeAdress: this.fb.group({
      street: ['', Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț\s\-.]+$/)],
      number: ['', Validators.pattern(/^\d+$/)],
      block: ['', Validators.pattern(/^[A-Za-z0-9]+$/)],
      floor: ['', Validators.pattern(/^\d{1,2}$/)],
      apartment: ['', Validators.pattern(/^\d{1,4}$/)],
      district: ['', Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț0-9]+$/)],
      city: ['', Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț\s\-]+$/)]
    }),
    tempAdress: this.fb.group({
      street: ['', Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț\s\-.]+$/)],
      number: ['', Validators.pattern(/^\d+$/)],
      block: ['', Validators.pattern(/^[A-Za-z0-9]+$/)],
      floor: ['', Validators.pattern(/^\d{1,2}$/)],
      apartment: ['', Validators.pattern(/^\d{1,4}$/)],
      district: ['', Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț0-9]+$/)],
      city: ['', Validators.pattern(/^[A-Za-zĂăÂâÎîȘșȚț\s\-]+$/)]
    }),
    phones: this.fb.array([]),
  }, {
    validators: [this.namePairValidator, this.addressPairValidator]

  });

  ngOnInit(): void {
    if (this.sameAsHome) {
      this.form.get('tempAdress')?.disable();
    }
  }

  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  addPhone(): void {
    this.phones.push(this.fb.group({
      label: [''],
      number: ['', [Validators.pattern(/^0[237][0-9]{8}$/)]]
    }, { validators: this.phoneLabelValidator.bind(this) })); 
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  onSave(): void {
    const formValues = this.form.value;
    let family = formValues.family?.trim();
    let given = formValues.given?.trim();

    if (!family && !given) {
      if (formValues.gender === 'masculin') given = 'Ion XY';
      else if (formValues.gender === 'feminin') given = 'Ioana XX';
      else {
        this.form.get('gender')?.setErrors({ required: true });
        this.form.markAllAsTouched();
        return;
      }
      family = 'Popescu';
      this.form.patchValue({ family, given });
    }

    this.form.markAllAsTouched();

    this.phones.controls.forEach(control => control.markAllAsTouched());
    if (this.form.valid) {
      const addresses: PatientAddress[] = [];

      const home = formValues.homeAdress;

      if (home) addresses.push({ ...home, use: 'home' });

      if (!this.sameAsHome && formValues.tempAdress) {
        addresses.push({ ...formValues.tempAdress, use: 'temp' });
      }

      const fullPatient: PatientInfo = {
        id: this.patient?.id || '',
        name: {
          family,
          given,
          prefix: [formValues.prefix]
        },
        identifier: formValues.identifier,
        birthDate: formValues.birthDate,
        gender: formValues.gender,
        note: formValues.note,
        adresses: addresses,
        phones: formValues.phones.filter((p: { number?: string }) => p.number?.trim() !== '')
      };
      this.save.emit(fullPatient);
    }
  }

  updateBirthDateFromIdentifier(): void {
    const identifier: string = this.form.get('identifier')?.value;
    if (identifier?.length === 13) {
      const s = identifier.charAt(0);
      const year = identifier.substring(1, 3);
      const month = identifier.substring(3, 5);
      const day = identifier.substring(5, 7);
      const yearPrefix = s === '1' || s === '2' ? '19' : s === '5' || s === '6' ? '20' : s === '3' || s === '4' ? '18' : '';
      const birthDate = `${yearPrefix}${year}-${month}-${day}`;

      if (yearPrefix) {
        this.form.patchValue({
          birthDate,
          gender: (s === '1' || s === '5' || s === '3') ? 'masculin' :
            (s === '2' || s === '6' || s === '4') ? 'feminin' : 'necunoscut'
        });
      }
    }
  }

  patchForm(patient: PatientInfo): void {
    const home = patient.adresses?.find((a: PatientAddress) => a.use === 'home') || {};
    const residence = patient.adresses?.find((a: PatientAddress) => a.use === 'temp') || {};

    this.form.patchValue({
      family: patient.name.family,
      given: patient.name.given,
      prefix: patient.name.prefix?.[0] || '',
      identifier: patient.identifier,
      birthDate: patient.birthDate,
      gender: patient.gender,
      note: patient.note,
      homeAdress: home
    });

    this.sameAsHome = Object.keys(residence).length === 0;

    if (this.sameAsHome) {
      this.form.get('tempAdress')?.patchValue(home);
      this.form.get('tempAdress')?.disable();
    } else {
      this.form.get('tempAdress')?.patchValue(residence);
      this.form.get('tempAdress')?.enable();
    }

    this.phones.clear();
    patient.phones?.forEach((phone: PatientPhone) => {
      this.phones.push(this.fb.group({
        label: [phone.label],
        number: [phone.number, Validators.pattern(/^0[237][0-9]{8}$/)]
      }, { validators: this.phoneLabelValidator.bind(this) }));
    });
  }

  cleanName(): void {
    const control = this.form.get('family');
    if (control?.value) {
      control.setValue(control.value.trim().replace(/\s+/g, ' '), { emitEvent: false });
    }
  }

  namePairValidator(form: FormGroup): ValidationErrors | null {
  const familyCtrl = form.get('family');
  const givenCtrl = form.get('given');

  const family = familyCtrl?.value?.toString().trim();
  const given = givenCtrl?.value?.toString().trim();

  const onlyOneFilled = (!!family && !given) || (!family && !!given);
  let invalid = false;

  if (onlyOneFilled) {
    const famErr = familyCtrl?.errors || {};
    famErr['namePairInvalid'] = true;
    familyCtrl?.setErrors(famErr);

    const givErr = givenCtrl?.errors || {};
    givErr['namePairInvalid'] = true;
    givenCtrl?.setErrors(givErr);

    invalid = true;
  }

  if (!onlyOneFilled) {
    // elimină eroarea dacă există, de la ambele
    if (familyCtrl?.hasError('namePairInvalid')) {
      const errs = familyCtrl.errors || {};
      delete errs['namePairInvalid'];
      familyCtrl.setErrors(Object.keys(errs).length ? errs : null);
    }
    if (givenCtrl?.hasError('namePairInvalid')) {
      const errs = givenCtrl.errors || {};
      delete errs['namePairInvalid'];
      givenCtrl.setErrors(Object.keys(errs).length ? errs : null);
    }
  }

  return invalid ? { namePairInvalid: true } : null;
}


addressPairValidator(form: FormGroup): ValidationErrors | null {
  const address = form.get('homeAdress') as FormGroup;
  const tempAddress = form.get('tempAdress')
  if (!address) return null;
  if (!tempAddress) return null;
  const values = address.value;
  const tempAddressValues = tempAddress.value;

  const isFilled = Object.values(values).some((val: any) => val && val.toString().trim() !== '');

  const required = ['street', 'district', 'city'];
  
  let invalid = false;

  required.forEach(field => {
    const ctrl = address.get(field);
    const value = ctrl?.value?.toString().trim();
    const hasError = ctrl?.hasError('addressRequired');

    if (isFilled && !value) {
      const currentErrors = ctrl?.errors || {};
      currentErrors['addressRequired'] = true;
      ctrl?.setErrors(currentErrors);
      invalid = true;
    }

    if ((!isFilled || value) && hasError) {
      const currentErrors = ctrl?.errors || {};
      delete currentErrors['addressRequired'];
      const hasOtherErrors = Object.keys(currentErrors).length > 0;
      ctrl?.setErrors(hasOtherErrors ? currentErrors : null);
    }
  });

  return invalid ? { addressPairInvalid: true } : null;
}


  onSameAsHomeChange(same: boolean): void {
    this.sameAsHome = same;

    const homeGroup = this.form.get('homeAdress') as FormGroup;
    const residenceGroup = this.form.get('tempAdress') as FormGroup;

    if (same) {
      residenceGroup.patchValue(homeGroup.getRawValue());
      residenceGroup.disable();
    } else {
      residenceGroup.reset();
      residenceGroup.enable();
    }
  }

  phoneLabelValidator(group: FormGroup): ValidationErrors | null {
    const number = group.get('number')?.value;
    const valid = group.get('number')?.valid;
    const label = group.get('label')?.value;

    if (number && valid && !label) {
      return { labelRequired: true };
    }

    return null;
  } 

  onCancel() {
    this.cancel.emit();
    if (this.mode === 'add') {
      this.patient = undefined;
    }
  }
  
}
