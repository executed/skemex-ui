import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {AuthService} from '../auth.service';
import {NotifierService} from 'angular-notifier';
import {Notification} from './notifications.model';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  public notifications: Notification[];
  private notificationsCount: number;
  private notifier: NotifierService;
  modalRef: BsModalRef;

  constructor(private appService: AppService,
              private authService: AuthService,
              private modalService: BsModalService,
              notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit() {
    this.getNotificationCount();
  }

  getNotificationCount() {
    this.appService.getNotificationsCount(this.authService.getCurrentUser().nickname).subscribe(
      data => {
        this.notificationsCount = data.data;
        console.log(this.notificationsCount);
      },
    );
  }

  getData() {
    this.appService.getNotifications(this.authService.getCurrentUser().nickname).subscribe(
      data => {
        this.notifications = data.data;
        this.notificationsCount = this.notifications.length;
      },
      error => {
        console.log(error);
      }
    );
  }

  viewedNotification(n: Notification) {
    n.viewed = true;
    console.log(n);
    this.appService.setViewedNotification(n).subscribe(
      data => {
        console.log(data);
        const index: number = this.notifications.indexOf(n);
        if (index !== -1) {
          this.notifications.splice(index, 1);
          this.notificationsCount = this.notifications.length;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  viewedAllNotification() {
    this.appService.makeNotificationsViewed(this.authService.getCurrentUser().nickname).subscribe(
      data => {
        this.notifications = data.data;
        this.notificationsCount = this.notifications.length;
        console.log(this.notifications);
        this.hideAllNotifications();
      },
      error => {
        console.log(error);
      }
    );
  }

  openModal(template: Notification) {
    this.getData();
    this.modalRef = this.modalService.show(template);
  }

  public showNotification( type: string, message: string ): void {
    this.notifier.notify( type, message );
  }

  /**
   * Hide oldest notification
   */
  public hideOldestNotification(): void {
    this.notifier.hideOldest();
  }

  /**
   * Hide newest notification
   */
  public hideNewestNotification(): void {
    this.notifier.hideNewest();
  }

  /**
   * Hide all notifications at once
   */
  public hideAllNotifications(): void {
    this.notifier.hideAll();
  }

  /**
   * Show a specific notification (with a custom notification ID)
   *
   * @param {string} type    Notification type
   * @param {string} message Notification message
   * @param {string} id      Notification ID
   */
  public showSpecificNotification( type: string, message: string, id: string ): void {
    this.notifier.show( {
      id,
      message,
      type
    } );
  }

  /**
   * Hide a specific notification (by a given notification ID)
   *
   * @param {string} id Notification ID
   */
  public hideSpecificNotification( id: string ): void {
    this.notifier.hide( id );
  }

}
