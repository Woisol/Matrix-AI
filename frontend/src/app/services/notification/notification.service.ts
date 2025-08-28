import { Injectable, inject } from '@angular/core';
import { NzNotificationDataOptions, NzNotificationService } from 'ng-zorro-antd/notification';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nzNotification = inject(NzNotificationService);

  private defaultOptions: NzNotificationDataOptions = {
    nzDuration: 3000,
    nzPauseOnHover: true,
  }

  /**
   * 显示成功通知
   */
  success(content: string, title: string = "成功", options?: NzNotificationDataOptions) {
    options = { ...this.defaultOptions, ...options };
    this.nzNotification.create('success' as NotificationType, title, content, options);
  }

  /**
   * 显示信息通知
   */
  info(content: string, title: string = "信息", options?: NzNotificationDataOptions) {
    options = { ...this.defaultOptions, ...options };
    this.nzNotification.create('info' as NotificationType, title, content, options);
  }

  /**
   * 显示警告通知
   */
  warning(content: string, title: string = "警告", options?: NzNotificationDataOptions) {
    options = { ...this.defaultOptions, ...options };
    this.nzNotification.create('warning' as NotificationType, title, content, options);
  }

  /**
   * 显示错误通知
   */
  error(content: string, title: string = "错误", options?: NzNotificationDataOptions) {
    options = { ...this.defaultOptions, ...options };
    this.nzNotification.create('error' as NotificationType, title, content, options);
  }


}
