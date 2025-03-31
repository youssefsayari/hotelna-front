
export interface User {
  idUser: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: number;
  password: string;
  OTP?: number;  
  typeUser: 'Admin' | 'Visiteur';
}