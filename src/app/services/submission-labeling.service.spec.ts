import { TestBed } from "@angular/core/testing";

import { SubmissionLabelingService } from "./submission-labeling.service";

describe("SubmissionLabelingService", () => {
  let service: SubmissionLabelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionLabelingService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
