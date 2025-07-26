export interface PatientInfo {
  id: string;                         
  name: HumanName;                    
  birthDate?: string;                    
  gender: GenderType;
  identifier?: string;                          
  phones?: PatientPhone[];              
  addresses?: PatientAddress[];         
  note?: string;                        
}

export interface PatientAddress {
  use?: 'home' | 'temp'; // domiciliu permanent (homeaddress) si resedinta (tempaddress)
  street?: string;         
  number?: string;        
  block?: string;          
  floor?: string;          
  apartment?: string;      
  district?: string;       
  city?: string;           
}

export interface PatientPhone {
  label: string;           
  number: string;         
}

export interface HumanName {
  family: string;        
  given: string;     
  prefix?: string[];       
}

export type GenderType = 'masculin' | 'feminin' | 'altul' | 'necunoscut' | "";