import { Chambre } from "./chambre";

// models/bloc.ts
export interface Bloc {
    idBloc: number;
    nomBloc: string;
    nombreEtages: number;
    chambres?: Chambre[]; // Optional since it might not always be fetched
  }