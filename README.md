# Project was based on the following technologies and tooling:

- [Angular CLI](https://github.com/angular/angular-cli) version 12.2.18 with Typescript

- HTML

- SASS

- JSON Server - REST API backend

- Git

- Visual Studio Code

- Angular Material - Version 12.2.13

- Angularx-qrcode - Version 12.0.3

- RxJS – Version 6.6.0 

- uuid - Version 8.3.2

Libraries:

- Bootstrap Version 5.3.7 + Bootstrap Icons Version 1.13.1
  

# To execute the application, the following steps must be performed:

- Install the `json-server` package globally using the npm package manager by executing the command:  
  **`npm install -g json-server`**

- Start the `json-server` by executing the command:  
  **`json-server --watch db.json`**, which will read and serve the data from the specified `db.json` file.  
  The mock API will be available at: **http://localhost:3000/**

- Install the frontend dependencies by executing:  
  **`npm install`**

- Start the Angular frontend by executing:  
  **`npm start`**

-  If you encounter errors while starting the Angular frontend (running `npm start`), related to OpenSSL, you must execute the command below first:

- bash
**export NODE_OPTIONS=--openssl-legacy-provider**

# Project Description
This project simulates a clinic’s internal system for managing patients using the HL7 FHIR Patient data model. The UI is split into two main sections:

- Left panel: Patient list (filtering, sorting, QR popup, column config)

- Right panel: Patient form with view/add/edit modes


🔑 Key Features
- Responsive layout for all screen sizes

- Configurable and sortable table (Name, Surname, Age, Gender, CNP)

- Real-time search by name/surname/CNP

- QR Code popup with encoded patient data

- Dynamic form modes (view, add, edit)

- Rich validation for all patient data

- Phone list with dynamic add/remove and labels

- Address duplication logic (home → residence)

- In-memory data service (DAL.service.ts)

# Patient Data Fields and Validation Rules
🧾 Identification & Demographics
- Name / Surname: letters, spaces, hyphens. If one is filled, both are required.

- Father’s Initials: 1–3 uppercase letters.

- CNP:

Must be valid in length and checksum.

Birthdate and gender are auto-filled from CNP.

Birthdate: Required if not extracted from CNP.

- Gender: Required in all cases.


☎️ Contact Information
Phone Numbers:

- 10-digit local numbers: start with 0, followed by 2, 3, or 7.

- Each number has a user-defined label (e.g., Home, Office).

- Numbers are dynamically managed.


🏠 Address
- Home Address:

Street, Number, Block, Floor, Apartment, District, City

- Residence Address:

Same fields as home.

- Option: “same as home” (auto-copies values).

- If filled, must include at least Street, District, and City.


📝 Other
Notes: Free-text area.

Validation logic:

- Patients can be saved with just gender → will auto-generate name based on gender:

Male: Ion XY Popescu

Female: Ioana XX Popescu

- Fields are marked red and error messages shown if invalid.

- Save button disabled if any validation fails.

- After saving, view mode is restored and list is updated with the last added on top of the list.

