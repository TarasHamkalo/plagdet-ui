import { TestBed } from "@angular/core/testing";

import { SimilarityHeatmapService } from "./similarity-heatmap.service";

describe("SimilarityHeatmapService", () => {
  let service: SimilarityHeatmapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimilarityHeatmapService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
