export enum Rate {
    ONE = 0,
    TWO = 1,
    THREE = 2,
    FOUR = 3,
    FIVE = 4
  }

export class RatingDTO {
    restaurantId!: number;
    score!: Rate;
    comment!: string;
    mail!: string;
}
