import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';

import { SSEService } from './see.service';

describe('SSEService', () => {
  const originalEventSource = (globalThis as any).EventSource;

  afterEach(() => {
    (globalThis as any).EventSource = originalEventSource;
  });

  it('re-enters Angular zone before emitting stream text chunks', () => {
    let createdInstance: any;

    class FakeEventSource {
      onmessage: ((event: MessageEvent) => void) | null = null;
      onerror: (() => void) | null = null;

      constructor(_url: string) {
        createdInstance = this;
      }

      addEventListener() { }
      close() { }
    }

    (globalThis as any).EventSource = FakeEventSource as any;

    TestBed.configureTestingModule({
      providers: [SSEService],
    });

    const service = TestBed.inject(SSEService);
    const zone = TestBed.inject(NgZone);
    const zoneRunSpy = spyOn(zone, 'run').and.callThrough();
    const runOutsideAngularSpy = spyOn(zone, 'runOutsideAngular').and.callThrough();
    const received: string[] = [];
    service.streamText('/api/test').subscribe((value) => received.push(value));

    createdInstance.onmessage?.({
      data: JSON.stringify({ chunk: '你' }),
    } as MessageEvent);

    expect(runOutsideAngularSpy).toHaveBeenCalled();
    expect(zoneRunSpy).toHaveBeenCalled();
    expect(received).toEqual(['你']);
  });
});
