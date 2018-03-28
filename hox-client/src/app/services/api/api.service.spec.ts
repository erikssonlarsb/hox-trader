import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule }  from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { ApiService } from './api.service';
import { AuthService } from '../auth/auth.service';

describe('ApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, AuthService],
      imports: [HttpModule]
    });
  });

  it('should be created', inject([ApiService], (service: ApiService) => {
    expect(service).toBeTruthy();
  }));
});

describe('ApiService (Mocked)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
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
    [ApiService, MockBackend], (service, mockBackend) => {
    expect(service).toBeDefined();
  })));
});
