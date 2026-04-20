import { TestBed } from '@angular/core/testing';

import { AdminInventoryService } from './admin-inventory.service';

describe('AdminInventoryService', () => {
  let service: AdminInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
