import { TypeUser } from './typeUser';
export interface User {
  idUser: number;       
  firstName: string;    
  lastName: string;     
  password: string;    
  email: string;       
  telephone: number;    
  OTP?: number;         
  typeUser: TypeUser;   
}

