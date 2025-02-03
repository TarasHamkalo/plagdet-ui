import { Pipe, PipeTransform } from "@angular/core";
import {TimeFormatting} from "../utils/time-formatting";

@Pipe({
  name: "minutesTime"
})
export class MinutesTimePipe implements PipeTransform {

  public transform(value: number): string {
    return TimeFormatting.mapToSecondsToHhMmSs(value);
  }

}
