import { TestBed } from "@angular/core/testing";

import { SlovakPaginatorService } from "./slovak-paginator.service";

describe("SlovakPaginatorService", () => {
  let service: SlovakPaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlovakPaginatorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
