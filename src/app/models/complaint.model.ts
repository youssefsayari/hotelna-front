
import { User } from './user.model'; // Adjust the path as needed
import  {ComplaintCategories} from './complaint-categories.enum'
import  {ComplaintStatus} from './complaint-status.enum'
export interface Complaint {
    id?: number;
    userId: number;
    complaintDate: Date | string; 
    description: string;
    status: ComplaintStatus;
    category: ComplaintCategories;
    resolutionDate?: Date | string | null;
    resolutionDetails?: string | null;
  }
  