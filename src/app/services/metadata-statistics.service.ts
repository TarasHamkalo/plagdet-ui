import {computed, Injectable} from "@angular/core";
import {Submission} from "../model/submission";
import {AnalysisContextService} from "../context/analysis-context.service";
import {MetadataStatistics} from "../types/metadata-statistics";

@Injectable({
  providedIn: "root"
})
export class MetadataStatisticsService {

  public static readonly DATE_DEVIATION_SECONDS = 30 * 24 * 60 * 60 * 1000;

  private metadataStatistics = computed(() => {
    const submissions = this.analysisContextService.getReport()()?.submissions;
    if (submissions !== undefined) {
      return this.calculateAverages([...submissions.values()].filter(s => !s.indexed));
    }

    return null;
  });

  constructor(private analysisContextService: AnalysisContextService) {
  }

  public calculateAverages(data: Submission[]): MetadataStatistics {
    const avgEditTime = this.calculateAvg(data.map(e => e.metadata.totalEditTime));

    const creationDateFiltered = data
      .filter(e => e.metadata.creationDate !== undefined)
      .map(e => e.metadata.creationDate!);

    const modificationDateFiltered = data
      .filter(e => e.metadata.modificationDate !== undefined)
      .map(e => e.metadata.modificationDate!);
    const avgCreationDate = this.calculateAvgFromModeYearDate(creationDateFiltered);
    const avgModificationDate = this.calculateAvgFromModeYearDate(modificationDateFiltered);

    return {
      avgEditTime,
      avgCreationDate,
      avgModificationDate,
    };
  }

  private calculateAvg(arr: number[]) {
    return arr.length > 0 ? (arr.reduce((s: number, e: number) => s + e) / arr.length) : 0;
  }

  private calculateAvgFromModeYearDate(dates: number[]) {
    const yearMode = this.findYearMode(dates);
    return this.calculateAvg(dates.filter(e => new Date(e).getFullYear() == yearMode));
  }

  private findYearMode(dates: number[]) {
    const yearCounts: Record<number, number> = {};
    dates.forEach(e => {
      const year = new Date(e).getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    let mostFrequentYear: number | null = null;
    let maxCount = 0;
    for (const year in yearCounts) {
      if (yearCounts[year] > maxCount) {
        mostFrequentYear = parseInt(year);
        maxCount = yearCounts[year];
      }
    }
    return mostFrequentYear;
  }

  public isBelowAvgEditTime(element: Submission): boolean {
    const statistics = this.metadataStatistics();
    if (statistics === null) {
      return false;
    }

    return element.metadata.totalEditTime < statistics.avgEditTime;
  }

  public isDateDeviating(
    element: Submission,
    dateField: "modificationDate" | "creationDate"
  ): boolean {
    const statistics = this.metadataStatistics();
    if (statistics === null) {
      return false;
    }

    const dateValue = element.metadata[dateField]!;
    if (!dateValue) {
      return true;
    }

    const avg = dateField == "modificationDate" ?
      statistics.avgModificationDate : statistics.avgCreationDate;

    const deviationRange = MetadataStatisticsService.DATE_DEVIATION_SECONDS;
    return Math.abs(dateValue - avg!) > deviationRange;
  }

}
