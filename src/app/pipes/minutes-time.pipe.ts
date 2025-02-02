import { Pipe, PipeTransform } from "@angular/core";
import {TimeFormatingService} from "../services/time-formating.service";

@Pipe({
  name: "minutesTime"
})
export class MinutesTimePipe implements PipeTransform {

  constructor(
    private timeFormatingService: TimeFormatingService
  ) {
  }

  public transform(value: number): string {
    return this.timeFormatingService.mapToSecondsToHhMmSs(value);
  }

}
