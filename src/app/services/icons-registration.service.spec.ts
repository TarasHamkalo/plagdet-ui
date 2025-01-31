import { TestBed } from "@angular/core/testing";

import { IconsRegistrationService } from "./icons-registration.service";

describe("IconsRegistrationService", () => {
  let service: IconsRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IconsRegistrationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
