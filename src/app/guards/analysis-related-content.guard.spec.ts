import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { analysisRelatedContentGuard } from "./analysis-related-content.guard";

describe("analysisRelatedContentGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => analysisRelatedContentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
