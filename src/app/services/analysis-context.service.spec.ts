import { TestBed } from '@angular/core/testing';

import { AnalysisContextService } from './analysis-context.service';

describe('AnalysisContextServiceService', () => {
  let service: AnalysisContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalysisContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
