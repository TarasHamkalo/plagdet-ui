import { CellHighlightDirective } from "./cell-highlight.directive";
import {MetadataStatisticsService} from "../services/metadata-statistics.service";

describe("CellHighlightDirective", () => {
  let metadataStatisticsService: MetadataStatisticsService;
  it("should create an instance", () => {
    const directive = new CellHighlightDirective(metadataStatisticsService);
    expect(directive).toBeTruthy();
  });
});
