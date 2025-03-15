import { TestBed } from "@angular/core/testing";

import { SubmissionGraphService } from "./submission-graph.service";

describe("SubmissionGraphService", () => {
  let service: SubmissionGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmissionGraphService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
