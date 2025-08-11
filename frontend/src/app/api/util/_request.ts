// 更完善的请求封装（fetch 版本）
// 提供：
// 1. 通用请求方法 with 泛型
// 2. Params 序列化 (& 数组 / 对象展平)
// 3. 可配置 baseURL（后续建议接入 Angular environment.ts）
// 4. 超时控制
// 5. 按 key 防抖（会自动取消上一次未发送或正在等待的防抖请求）
// 6. 请求去重（同 method+url+序列化 body+params 可复用同一个请求）
// 7. AbortController 取消
// 8. 统一错误对象 ApiError
// 9. 可选 raw 返回 Response
// 10. 轻量不依赖 Angular HttpClient；若未来迁移，可把逻辑放到 service + interceptor

import { HttpClient } from "@angular/common/http";

// ================= 配置区 =================
const DEFAULT_BASE_URL = '/api/v1';
// 可通过全局变量或构建注入覆盖（自行按项目需要扩展）
const BASE_URL: string = (typeof window !== 'undefined' && (window as any).__API_BASE__) || DEFAULT_BASE_URL;
const DEFAULT_DEBOUNCE_DELAY = 300;
const DEFAULT_TIMEOUT = 15_000; // 15s

// ================= 类型定义 =================
export interface RequestOptions<TBody = any> {
  params?: Record<string, any>;
  body?: TBody;
  headers?: Record<string, string>;
  debounceKey?: string;          // 指定后启用防抖；不同 key 互不影响
  debounceDelay?: number;        // 默认 300ms
  dedupe?: boolean;              // 同 signature 复用结果
  timeout?: number;              // ms
  signal?: AbortSignal;          // 额外外部取消
  raw?: boolean;                 // 返回 Response 而不是解析后的 JSON
  parseJson?: boolean;           // 对非 204 尝试解析 JSON，默认 true
  method?: string;               // 内部使用
  // 允许透传 fetch 其他配置
  credentials?: RequestInit['credentials'];
  mode?: RequestInit['mode'];
  cache?: RequestInit['cache'];
  referrerPolicy?: RequestInit['referrerPolicy'];
}

export class ApiError extends Error {
  status: number;
  body: any;
  response: Response;
  constructor(message: string, response: Response, body: any) {
    super(message);
    this.name = 'ApiError';
    this.status = response.status;
    this.body = body;
    this.response = response;
  }
}

// ================= 内部工具 =================
function serializeParams(params?: Record<string, any>): string {
  if (!params) return '';
  const parts: string[] = [];
  const append = (key: string, value: any) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach(v => append(key, v));
    } else if (typeof value === 'object' && !(value instanceof Date)) {
      Object.keys(value).forEach(k => append(`${key}.${k}`, value[k]));
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value instanceof Date ? value.toISOString() : value)}`);
    }
  };
  Object.keys(params).forEach(k => append(k, params[k]));
  return parts.length ? `?${parts.join('&')}` : '';
}

function buildUrl(url: string, params?: Record<string, any>): string {
  // 允许传绝对地址（含 http(s):// 或以 / 开头）
  const isAbsolute = /^https?:\/\//i.test(url);
  const base = isAbsolute ? '' : BASE_URL;
  return `${base}${url}${serializeParams(params)}`;
}

function stableStringify(obj: any): string {
  if (obj === undefined) return 'undefined';
  if (obj === null) return 'null';
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(obj).sort().map(k => `${k}:${stableStringify(obj[k])}`).join(',') + '}';
}

interface DebounceRecord { timer: ReturnType<typeof setTimeout>; controller: AbortController; }
const debounceMap = new Map<string, DebounceRecord>();
const inflightMap = new Map<string, Promise<any>>();

function buildSignature(method: string, url: string, params?: any, body?: any): string {
  return `${method}::${url}::${stableStringify(params)}::${stableStringify(body)}`;
}

async function coreRequest<T>(url: string, options: RequestOptions = {}): Promise<T | Response> {
  const {
    params,
    body,
    headers = {},
    debounceKey,
    debounceDelay = DEFAULT_DEBOUNCE_DELAY,
    dedupe = false,
    timeout = DEFAULT_TIMEOUT,
    signal: externalSignal,
    raw = false,
    parseJson = true,
    method = 'GET',
    credentials, mode, cache, referrerPolicy
  } = options;

  const fullUrl = buildUrl(url, params);
  const signature = dedupe ? buildSignature(method, fullUrl, undefined, body) : '';

  if (dedupe && inflightMap.has(signature)) {
    return inflightMap.get(signature)!;
  }

  // 处理防抖：若存在相同 key 未触发的 timer，清除并 abort controller
  if (debounceKey) {
    const existing = debounceMap.get(debounceKey);
    if (existing) {
      clearTimeout(existing.timer);
      existing.controller.abort(); // 取消上一个尚未发出的（或准备中的）请求
    }
  }

  // AbortController 合并（内部 + 外部）
  const controller = new AbortController();
  const signals: AbortSignal[] = [controller.signal];
  if (externalSignal) signals.push(externalSignal);
  const abortSignal = signals.length === 1 ? signals[0] : mergeAbortSignals(signals);

  // 超时逻辑
  const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : undefined;

  const exec = () => fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': body instanceof FormData ? undefined as any : 'application/json',
      ...headers
    },
    body: method === 'GET' || method === 'HEAD' ? undefined : (body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined),
    signal: abortSignal,
    credentials, mode, cache, referrerPolicy
  }).then(async (res) => {
    clearTimeout(timeoutId);
    if (!res.ok) {
      let errBody: any = null;
      try { errBody = await res.clone().json(); } catch { try { errBody = await res.clone().text(); } catch { /* ignore */ } }
      throw new ApiError(typeof errBody === 'string' ? errBody : (errBody?.message || res.statusText), res, errBody);
    }
    if (raw) return res;
    if (res.status === 204) return undefined as any;
    if (!parseJson) return res as any;
    try { return await res.json(); } catch { return undefined as any; }
  }).finally(() => {
    if (dedupe) inflightMap.delete(signature);
    if (debounceKey) debounceMap.delete(debounceKey);
  });

  let promise: Promise<any>;

  if (debounceKey) {
    promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        exec().then(resolve).catch(reject);
      }, debounceDelay);
      debounceMap.set(debounceKey, { timer, controller });
    });
  } else {
    promise = exec();
  }

  if (dedupe) inflightMap.set(signature, promise);

  return promise;
}

// 合并多个 AbortSignal（最早触发的任一一个都会中断）
function mergeAbortSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  signals.forEach(sig => {
    if (sig.aborted) controller.abort();
    else sig.addEventListener('abort', onAbort, { once: true });
  });
  return controller.signal;
}

// ================= API 暴露 =================
function verbFactory(method: string) {
  return function <T = any>(url: string, opts: Omit<RequestOptions, 'method' | 'body'> & { body?: any } = {}): Promise<T> {
    return coreRequest<T>(url, { ...opts, method, body: opts.body }) as Promise<T>;
  };
}

export const api = {
  request: coreRequest, // 低级统一入口
  get: verbFactory('GET'),
  delete: verbFactory('DELETE'),
  head: verbFactory('HEAD'),
  post: verbFactory('POST'),
  put: verbFactory('PUT'),
  patch: verbFactory('PATCH'),
  // 简化的防抖 GET（自动使用 url 作为 key，可自定义）
  dGet: <T = any>(url: string, opts: Omit<RequestOptions, 'method'> = {}) => coreRequest<T>(url, { ...opts, method: 'GET', debounceKey: opts.debounceKey || `GET:${url}`, dedupe: true })
} as const;

// ================= 原有工具（保留） =================
export function throttle<T>(func: (...args: any[]) => T, limit: number) {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  return function (...args: any[]) {
    // @ts-expect-error any
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export function debounce<T>(func: (...args: any[]) => T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    // @ts-expect-error any
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}