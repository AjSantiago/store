import { Component } from '@angular/core';

@Component({
  selector: 'app-thanks-page',
  template: `
    <div class="container">
      <h1 class="title">Thank you</h1>
      <p class="content">Your order is on the way!</p>
      <span
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
        molestiae harum accusamus ipsam veritatis pariatur quis quo ipsum
        ratione, praesentium numquam earum reprehenderit sapiente possimus non
        assumenda aut id cum?</span
      >
    </div>
  `,
  styleUrls: ['./thanks-page.component.scss'],
})
export class ThanksPageComponent {}
