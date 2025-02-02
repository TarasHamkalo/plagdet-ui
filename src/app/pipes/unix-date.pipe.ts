import { Pipe, PipeTransform } from "@angular/core";
import {TimeFormatingService} from "../services/time-formating.service";

@Pipe({
  name: "unixDate"
})
export class UnixDatePipe implements PipeTransform {

  constructor(
    private timeFormatingService: TimeFormatingService
  ) {
  }

  public transform(value: number | string | null | undefined): string {
    if (!value) {
      return "Invalid Date";
    }

    const unixTime = Number(value);

    if (isNaN(unixTime)) {
      return "Invalid date";
    }

    return this.timeFormatingService.mapUnixTimeToDate(unixTime);
  }


}
