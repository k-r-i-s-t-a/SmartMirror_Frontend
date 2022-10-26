import { Component, Input } from '@angular/core';

@Component({
  selector: 'event-icon',
  template: `
    <div class="event" [style.font-size]="size">
      <code class="symbol" [style.color]="color">
        {{ day }}
      </code>
      <svg class="calendar-icon" [style.fill]="color">
        <use href="../../../assets/icon_sprite.svg#calendar"></use>
      </svg>
    </div>
  `,
  styleUrls: ['./event-icon.component.scss'],
})
export class EventIconComponent {
  @Input() day!: string;
  @Input() size: string = '1rem';
  @Input() color: string = '#eaedf0'
}
