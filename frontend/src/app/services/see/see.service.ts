// TODO 接入 logger
import { inject, Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface SSEMessage {
  event?: string;
  data: any;
}

export interface SSEStreamResult {
  chunks: string[];  // 累积的文本片段
  progress?: { current: number; total: number };
  complete?: any;    // 最终完整数据
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class SSEService {
  private zone = inject(NgZone);
  /**
   * 创建SSE连接并返回Observable
   * @param url SSE端点URL
   * @returns Observable<SSEStreamResult>
   */
  createEventSource(url: string): Observable<SSEStreamResult> {
    return new Observable(observer => {
      let eventSource!: EventSource;
      const result: SSEStreamResult = { chunks: [] };

      this.zone.runOutsideAngular(() => {
        eventSource = new EventSource(url);

        // 处理普通消息（默认data事件）
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.chunk) {
              result.chunks.push(data.chunk);
              this.zone.run(() => observer.next({ ...result }));
            }
          } catch (e) {
            console.warn('Failed to parse SSE data:', event.data);
          }
        };

        // 处理section事件
        eventSource.addEventListener('section', (event: any) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Section:', data);
            this.zone.run(() => observer.next({ ...result }));
          } catch (e) {
            console.warn('Failed to parse section event:', event.data);
          }
        });

        // 处理progress事件
        eventSource.addEventListener('progress', (event: any) => {
          try {
            const data = JSON.parse(event.data);
            result.progress = data;
            this.zone.run(() => observer.next({ ...result }));
          } catch (e) {
            console.warn('Failed to parse progress event:', event.data);
          }
        });

        // 处理complete事件
        eventSource.addEventListener('complete', (event: any) => {
          try {
            const data = JSON.parse(event.data);
            result.complete = data;
            this.zone.run(() => {
              observer.next({ ...result });
              observer.complete();
            });
            eventSource.close();
          } catch (e) {
            console.warn('Failed to parse complete event:', event.data);
          }
        });

        // 处理error事件
        eventSource.addEventListener('error', (event: any) => {
          try {
            const data = JSON.parse(event.data);
            result.error = data.error;
            this.zone.run(() => observer.error(result));
            eventSource.close();
          } catch (e) {
            // 网络错误或连接关闭
            this.zone.run(() => {
              if (eventSource.readyState === EventSource.CLOSED) {
                observer.error({ error: '连接已关闭' });
              } else {
                observer.error({ error: '网络错误' });
              }
            });
            eventSource.close();
          }
        });
      });

      return () => {
        eventSource?.close();
      };
    });
  }

  /**
   * 简化版：只返回累积的完整文本
   * @param url SSE端点URL
   * @returns Observable<string> 实时累积的文本
   */
  streamText(url: string): Observable<string> {
    return new Observable(observer => {
      let fullText = '';
      let eventSource!: EventSource;

      this.zone.runOutsideAngular(() => {
        eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.chunk) {
              fullText += data.chunk;
              this.zone.run(() => observer.next(fullText));
            }
          } catch (e) {
            console.warn('Failed to parse SSE data:', event.data);
          }
        };

        eventSource.addEventListener('complete', () => {
          this.zone.run(() => observer.complete());
          eventSource.close();
        });

        eventSource.onerror = () => {
          this.zone.run(() => observer.error('Stream error'));
          eventSource.close();
        };
      });

      return () => eventSource?.close();
    });
  }
}
