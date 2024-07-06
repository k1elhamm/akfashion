import { TestBed } from '@angular/core/testing';

import { SenditService } from './sendit.service';

describe('SenditService', () => {
  let service: SenditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SenditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
