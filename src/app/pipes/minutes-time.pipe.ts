import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "minutesTime"
})
export class MinutesTimePipe implements PipeTransform {


  public transform(value: number): string {
    if (isNaN(value) || value == 0) {
      return "00:00:00";
    }

    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  }

}
