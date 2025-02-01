import { TestBed } from "@angular/core/testing";

import { MonacoDecorationService } from "./monaco-decoration.service";

describe("MonacoDecorationService", () => {
  let service: MonacoDecorationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonacoDecorationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
