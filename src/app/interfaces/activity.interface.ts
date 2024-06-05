import { Timestamp } from '@angular/fire/firestore';

export interface Activity {
  id?: string;
  name: string;
  location: string;
  quantity: number;
  date: Timestamp;
  signups: string[];
}
