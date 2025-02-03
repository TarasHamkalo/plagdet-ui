import {TestBed} from "@angular/core/testing";

import {RouteContextService} from "./route-context.service";

describe("RouteContextService", () => {
  let service: RouteContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteContextService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
