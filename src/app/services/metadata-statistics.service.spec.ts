import { TestBed } from "@angular/core/testing";

import { MetadataStatisticsService } from "./metadata-statistics.service";

describe("MetadataStatisticsService", () => {
  let service: MetadataStatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetadataStatisticsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
