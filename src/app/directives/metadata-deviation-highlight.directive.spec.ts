import { MetadataDeviationHighlightDirective } from "./metadata-deviation-highlight.directive";
import {MetadataStatisticsService} from "../services/metadata-statistics.service";

describe("MetadataDeviationHighlightDirective", () => {
  let metadataStatisticsService: MetadataStatisticsService;
  it("should create an instance", () => {
    const directive = new MetadataDeviationHighlightDirective(metadataStatisticsService);
    expect(directive).toBeTruthy();
  });
});
