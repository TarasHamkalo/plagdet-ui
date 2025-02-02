import {Injectable} from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TimeFormatingService {

  public mapUnixTimeToDate(unixTime: number): string {
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

  public mapToSecondsToHhMmSs(value: number): string {
    if (isNaN(value) || value == 0) {
      return "00:00:00";
    }

    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
  }
}
