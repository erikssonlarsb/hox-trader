import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule }  from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
      imports: [HttpModule]
    });
  });;

  it('should be created', inject([AuthService], (service) => {
    expect(service).toBeDefined();
  }));
});

describe('AuthService (Mocked)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
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
    [AuthService, MockBackend], (service, mockBackend) => {
    expect(service).toBeDefined();
  })));
});
