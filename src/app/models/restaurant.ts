export enum Status {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED'
}

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  statut: Status;
  typeRestaurant: string;
  openTime: string;
  closeTime: string;
}
