import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 极简 HttpClient 封装（Observable 主，Promise 辅助）
const BASE_URL = '/api';

export interface RequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

function buildParams(params?: Record<string, any>) {
  let hp = new HttpParams();
  if (!params) return hp;
  const append = (k: string, v: any) => {
    if (v === null || v === undefined) return;
    if (Array.isArray(v)) v.forEach(x => append(k, x));
    else if (v instanceof Date) hp = hp.append(k, v.toISOString());
    else if (typeof v === 'object') Object.keys(v).forEach(sub => append(`${k}.${sub}`, v[sub]));
    else hp = hp.append(k, v);
  };
  Object.keys(params).forEach(k => append(k, params[k]));
  return hp;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private url(u: string) { return /^https?:\/\//.test(u) ? u : BASE_URL + u; }

  get$<T>(u: string, opts: RequestOptions = {}): Observable<T> {
    return this.http.get<T>(this.url(u), {
      params: buildParams(opts.params),
      headers: new HttpHeaders(opts.headers || {})
    }).pipe(
      catchError(err => { throw err; })
    );
  }
  post$<T>(u: string, body: any, opts: RequestOptions = {}) { return this.http.post<T>(this.url(u), body, this.options(opts)); }
  put$<T>(u: string, body: any, opts: RequestOptions = {}) { return this.http.put<T>(this.url(u), body, this.options(opts)); }
  patch$<T>(u: string, body: any, opts: RequestOptions = {}) { return this.http.patch<T>(this.url(u), body, this.options(opts)); }
  delete$<T>(u: string, opts: RequestOptions = {}) { return this.http.delete<T>(this.url(u), this.options(opts)); }

  // Promise 便捷方法
  get<T>(u: string, opts?: RequestOptions) { return lastValueFrom(this.get$<T>(u, opts)); }
  post<T>(u: string, body: any, opts?: RequestOptions) { return lastValueFrom(this.post$<T>(u, body, opts)); }
  put<T>(u: string, body: any, opts?: RequestOptions) { return lastValueFrom(this.put$<T>(u, body, opts)); }
  patch<T>(u: string, body: any, opts?: RequestOptions) { return lastValueFrom(this.patch$<T>(u, body, opts)); }
  delete<T>(u: string, opts?: RequestOptions) { return lastValueFrom(this.delete$<T>(u, opts)); }

  private options(opts: RequestOptions) {
    return {
      params: buildParams(opts.params),
      headers: new HttpHeaders(opts.headers || {})
    };
  }
}

// 兼容旧 api 名称（可逐步迁移）
export const api = {
  get: <T = any>(url: string, opts?: RequestOptions) => inject(ApiService).get<T>(url, opts),
  post: <T = any>(url: string, body: any, opts?: RequestOptions) => inject(ApiService).post<T>(url, body, opts),
  put: <T = any>(url: string, body: any, opts?: RequestOptions) => inject(ApiService).put<T>(url, body, opts),
  patch: <T = any>(url: string, body: any, opts?: RequestOptions) => inject(ApiService).patch<T>(url, body, opts),
  delete: <T = any>(url: string, opts?: RequestOptions) => inject(ApiService).delete<T>(url, opts)
} as const;
