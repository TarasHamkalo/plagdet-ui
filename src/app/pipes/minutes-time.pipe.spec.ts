import { MinutesTimePipe } from "./minutes-time.pipe";

describe("MinutesTimePipe", () => {
  it("create an instance", () => {
    const pipe = new MinutesTimePipe();
    expect(pipe).toBeTruthy();
  });
});
