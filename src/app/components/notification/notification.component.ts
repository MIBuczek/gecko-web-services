import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NotificationType } from 'models/general';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  @Input({ required: true }) variant: NotificationType = 'info';
  @Input({ required: true }) title: string = '';
}
