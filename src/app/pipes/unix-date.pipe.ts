import { Pipe, PipeTransform } from "@angular/core";

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

    return this.mapUnixTimeToDate(unixTime);
  }

  protected mapUnixTimeToDate(unixTime: number): string {
    if (unixTime.toString().length === 10) {
      unixTime *= 1000;
    }

    const date = new Date(unixTime);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

}
