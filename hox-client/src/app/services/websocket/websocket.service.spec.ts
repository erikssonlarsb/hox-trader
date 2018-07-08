import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule }  from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { WebSocketService } from './websocket.service';

describe('WebSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService],
      imports: [HttpModule]
    });
  });;

  it('should be created', inject([WebSocketService], (service) => {
    expect(service).toBeDefined();
  }));
});

describe('AuthService (Mocked)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });

  it('should be created', async(inject(
    [WebSocketService, MockBackend], (service, mockBackend) => {
    expect(service).toBeDefined();
  })));
});
