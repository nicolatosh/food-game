import { TestBed } from '@angular/core/testing';

import { ServersseService } from './serversse.service';

describe('ServersseService', () => {
  let service: ServersseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServersseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
