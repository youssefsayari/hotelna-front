export class TableRes {
    id?: number;
    nbPlaces!: number;
    disponibilite: boolean = true;
    userId!: number;
    restaurant?: {
      id: number;
      name?: string;
    };
}
