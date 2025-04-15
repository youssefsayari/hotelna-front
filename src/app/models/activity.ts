import { TypeActivity } from './typeActivity'; 

export interface Activity {
  id?: number;               
  name: string;
  startDate: string;         
  startTime: string;         
  description: string;
  price: number;
  typeActivity: TypeActivity; 
  capacity: number;          
}
