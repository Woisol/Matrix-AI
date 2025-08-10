// import { throttle,debounce } from "rxjs";

const BASE_URL = '/api/v1'
const DEBOUNCE_DELAY = 300; // 300ms debounce delay

// 基础请求封装
async function request<T>(method: string, url: string, body?: any, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init
  });
  if (!res.ok) {
    // 尝试解析错误体
    let errMsg: any;
    try { errMsg = await res.json(); } catch { errMsg = await res.text(); }
    throw new Error(typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg));
  }
  // 无内容
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// Promise 版本的 debounce：连续调用时仅保留最后一次，返回的 Promise 会在执行后 resolve
function debouncePromise<T>(fn: () => Promise<T>, delay: number): Promise<T> {
  // 单实例全局 timer，可按需扩展 key 版本
  if ((debouncePromise as any)._timer) {
    clearTimeout((debouncePromise as any)._timer);
  }
  return new Promise<T>((resolve, reject) => {
    (debouncePromise as any)._timer = setTimeout(() => {
      fn().then(resolve).catch(reject);
    }, delay);
  });
}

export const api = {
  get: <T = any>(url: string, { debounce = false } = {}): Promise<T> => {
    const exec = () => request<T>('GET', url);
    return debounce ? debouncePromise(exec, DEBOUNCE_DELAY) : exec();
  },
  post: <T = any>(url: string, body: any, { debounce = false } = {}): Promise<T> => {
    const exec = () => request<T>('POST', url, body);
    return debounce ? debouncePromise(exec, DEBOUNCE_DELAY) : exec();
  },
  put: <T = any>(url: string, body: any, { debounce = false } = {}): Promise<T> => {
    const exec = () => request<T>('PUT', url, body);
    return debounce ? debouncePromise(exec, DEBOUNCE_DELAY) : exec();
  },
  delete: <T = any>(url: string, { debounce = false } = {}): Promise<T> => {
    const exec = () => request<T>('DELETE', url);
    return debounce ? debouncePromise(exec, DEBOUNCE_DELAY) : exec();
  },
  patch: <T = any>(url: string, body: any, { debounce = false } = {}): Promise<T> => {
    const exec = () => request<T>('PATCH', url, body);
    return debounce ? debouncePromise(exec, DEBOUNCE_DELAY) : exec();
  }
} as const;

// 原有工具（保留）
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