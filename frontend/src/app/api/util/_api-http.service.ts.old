import { Injectable, inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, timeout, lastValueFrom, shareReplay } from 'rxjs';
import { catchError } from 'rxjs/operators';

// ====== 全局配置 Token ======
export interface ApiHttpConfig {
  baseUrl?: string;          // 统一前缀，如 /api/v1
  defaultTimeout?: number;   // 默认超时(ms)
}

export const API_HTTP_CONFIG = new InjectionToken<ApiHttpConfig>('API_HTTP_CONFIG', {
  providedIn: 'root',
  factory: () => ({ baseUrl: '/api', defaultTimeout: 15_000 })
});

// ====== 错误类型 ======
export class ApiError extends Error {
  status: number;
  body: any;
  constructor(msg: string, status: number, body: any) {
    super(msg);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ====== 请求可选项 ======
export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeoutMs?: number;
  responseType?: 'json' | 'text' | 'blob';
  dedupeKey?: string;        // 简单去重 key（同 key 同时多次调用复用一个请求）
  cacheTTL?: number;         // 缓存毫秒 (与 dedupeKey 或自动签名一起使用)
  observe?: 'body';          // 预留扩展
  body?: any;                // verbFactory 统一处理
}

interface CacheEntry { exp: number; obs: Observable<any>; }

@Injectable({ providedIn: 'root' })
export class ApiHttpService {
  private http = inject(HttpClient);
  private cfg = inject(API_HTTP_CONFIG);

  private cache = new Map<string, CacheEntry>();
  private inflight = new Map<string, Observable<any>>();

  // ====== 公共方法（Observable 版） ======
  get$<T>(url: string, opts?: RequestOptions) { return this.requestObs<T>('GET', url, opts); }
  delete$<T>(url: string, opts?: RequestOptions) { return this.requestObs<T>('DELETE', url, opts); }
  head$<T>(url: string, opts?: RequestOptions) { return this.requestObs<T>('HEAD', url, opts); }
  post$<T>(url: string, body: any, opts?: RequestOptions) { return this.requestObs<T>('POST', url, { ...opts, body }); }
  put$<T>(url: string, body: any, opts?: RequestOptions) { return this.requestObs<T>('PUT', url, { ...opts, body }); }
  patch$<T>(url: string, body: any, opts?: RequestOptions) { return this.requestObs<T>('PATCH', url, { ...opts, body }); }

  // ====== 便捷 Promise 版 ======
  get<T>(url: string, opts?: RequestOptions) { return lastValueFrom(this.get$<T>(url, opts)); }
  delete<T>(url: string, opts?: RequestOptions) { return lastValueFrom(this.delete$<T>(url, opts)); }
  head<T>(url: string, opts?: RequestOptions) { return lastValueFrom(this.head$<T>(url, opts)); }
  post<T>(url: string, body: any, opts?: RequestOptions) { return lastValueFrom(this.post$<T>(url, body, opts)); }
  put<T>(url: string, body: any, opts?: RequestOptions) { return lastValueFrom(this.put$<T>(url, body, opts)); }
  patch<T>(url: string, body: any, opts?: RequestOptions) { return lastValueFrom(this.patch$<T>(url, body, opts)); }

  // ====== 核心请求实现 ======
  private requestObs<T>(method: string, url: string, opts: RequestOptions = {}): Observable<T> {
    const {
      params,
      headers,
      timeoutMs = this.cfg.defaultTimeout,
      responseType = 'json',
      dedupeKey,
      cacheTTL,
      body
    } = opts;

    const fullUrl = this.normalizeUrl(url);
    const key = dedupeKey || this.buildSignature(method, fullUrl, params, body);

    // 缓存命中
    if (cacheTTL && this.cache.has(key)) {
      const entry = this.cache.get(key)!;
      if (entry.exp > Date.now()) return entry.obs as Observable<T>;
      this.cache.delete(key);
    }

    // in-flight 去重
    if (this.inflight.has(key)) {
      return this.inflight.get(key)! as Observable<T>;
    }

    let httpParams = new HttpParams();
    if (params) httpParams = this.buildParams(params);

    const obs = this.http.request<T>(method, fullUrl, {
      body,
      observe: 'body',
      responseType: responseType as any,
      headers: new HttpHeaders(headers || {}),
      params: httpParams
    }).pipe(
      timeout({ each: timeoutMs }),
      catchError(e => this.handleError(e)),
      shareReplay(1)
    );

    this.inflight.set(key, obs);
    const finalize = () => this.inflight.delete(key);
    obs.subscribe({ next: finalize, error: finalize, complete: finalize });

    if (cacheTTL) {
      this.cache.set(key, { exp: Date.now() + cacheTTL, obs });
    }
    return obs as Observable<T>;
  }

  // ====== 工具方法 ======
  private normalizeUrl(url: string): string {
    if (/^https?:\/\//i.test(url)) return url; // 绝对
    return `${this.cfg.baseUrl || ''}${url}`;
  }

  private buildParams(params: Record<string, any>): HttpParams {
    let hp = new HttpParams();
    const append = (k: string, v: any) => {
      if (v === null || v === undefined) return;
      if (Array.isArray(v)) v.forEach(item => append(k, item));
      else if (v instanceof Date) hp = hp.append(k, v.toISOString());
      else if (typeof v === 'object') Object.keys(v).forEach(sub => append(`${k}.${sub}`, v[sub]));
      else hp = hp.append(k, v);
    };
    Object.keys(params).forEach(k => append(k, params[k]));
    return hp;
  }

  private buildSignature(method: string, url: string, params?: any, body?: any): string {
    return `${method}:${url}:${this.stableStringify(params)}:${this.stableStringify(body)}`;
  }

  private stableStringify(obj: any): string {
    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj !== 'object') return String(obj);
    if (Array.isArray(obj)) return '[' + obj.map(o => this.stableStringify(o)).join(',') + ']';
    return '{' + Object.keys(obj).sort().map(k => `${k}:${this.stableStringify(obj[k])}`).join(',') + '}';
  }

  private handleError(err: HttpErrorResponse) {
    const body = err.error;
    const message = (body && (body.message || body.error)) || err.message || 'HTTP Error';
    return throwError(() => new ApiError(message, err.status, body));
  }
}

// 用法示例：
// constructor(private api: ApiHttpService) {}
// this.api.get('/courses', { params: { page:1 }, cacheTTL: 5000 }).then(res => ...) ;
// this.api.post('/login', { username, password }).catch(e => ...);
