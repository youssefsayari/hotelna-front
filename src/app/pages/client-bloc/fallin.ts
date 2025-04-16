import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

export const fallInAnimation = trigger('fallIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-50px)' }), // Start above the screen
      stagger(100, [ // Delay between each card
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })) // Fall into place
      ])
    ], { optional: true })
  ])
]);