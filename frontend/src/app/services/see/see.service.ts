import { Injectable } from '@angular/core';
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
  /**
   * 创建SSE连接并返回Observable
   * @param url SSE端点URL
   * @returns Observable<SSEStreamResult>
   */
  createEventSource(url: string): Observable<SSEStreamResult> {
    return new Observable(observer => {
      const eventSource = new EventSource(url);
      const result: SSEStreamResult = { chunks: [] };

      // 处理普通消息（默认data事件）
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.chunk) {
            result.chunks.push(data.chunk);
            observer.next({ ...result });
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
          observer.next({ ...result });
        } catch (e) {
          console.warn('Failed to parse section event:', event.data);
        }
      });

      // 处理progress事件
      eventSource.addEventListener('progress', (event: any) => {
        try {
          const data = JSON.parse(event.data);
          result.progress = data;
          observer.next({ ...result });
        } catch (e) {
          console.warn('Failed to parse progress event:', event.data);
        }
      });

      // 处理complete事件
      eventSource.addEventListener('complete', (event: any) => {
        try {
          const data = JSON.parse(event.data);
          result.complete = data;
          observer.next({ ...result });
          observer.complete();
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
          observer.error(result);
          eventSource.close();
        } catch (e) {
          // 网络错误或连接关闭
          if (eventSource.readyState === EventSource.CLOSED) {
            observer.error({ error: '连接已关闭' });
          } else {
            observer.error({ error: '网络错误' });
          }
          eventSource.close();
        }
      });

      // 清理函数
      return () => {
        eventSource.close();
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
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.chunk) {
            fullText += data.chunk;
            observer.next(fullText);
          }
        } catch (e) {
          console.warn('Failed to parse SSE data:', event.data);
        }
      };

      eventSource.addEventListener('complete', () => {
        observer.complete();
        eventSource.close();
      });

      eventSource.onerror = () => {
        observer.error('Stream error');
        eventSource.close();
      };

      return () => eventSource.close();
    });
  }
}
