import {Pipe, PipeTransform} from "@angular/core";
import {TimeFormatting} from "../utils/time-formatting";

@Pipe({
  name: "unixDate"
})
export class UnixDatePipe implements PipeTransform {

  public transform(value: number | string | null | undefined): string {
    if (!value) {
      return "Invalid Date";
    }

    const unixTime = Number(value);

    if (isNaN(unixTime)) {
      return "Invalid date";
    }

    return TimeFormatting.mapUnixTimeToDate(unixTime);
  }


}
