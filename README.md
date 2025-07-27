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

```bash
export NODE_OPTIONS=--openssl-legacy-provider