export enum TypeChambre {
    SIMPLE = 'SIMPLE',
    DOUBLE = 'DOUBLE',
    SUITE = 'SUITE'
  }
  
  export enum EtatChambre {
    DISPONIBLE = 'DISPONIBLE',
    OCCUPEE = 'OCCUPEE',
    EN_NETTOYAGE = 'EN_NETTOYAGE'
  }
  
  export enum ChambreReservation {
    NON_RESERVEE = 'NON_RESERVEE',
    RESERVEE = 'RESERVEE'
  }

export interface Chambre {
    idChambre: number; 
    typeChambre: TypeChambre; 
    numero: number; 
    etat: EtatChambre; 
    chambreEtat: ChambreReservation; 
    etage: number; 
    user: number; 
  }
  