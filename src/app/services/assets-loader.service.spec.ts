import { TestBed } from "@angular/core/testing";

import { AssetsLoaderService } from "./assets-loader.service";

describe("AssetsLoaderService", () => {
  let service: AssetsLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetsLoaderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
