import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class RouteContextService {

  private propertyMap: Record<string, string> = {};

  public putProperty(key: string, value: string, prefix = ""): void {
    this.propertyMap[`${prefix}${key}`] = value;
  }

  public popProperty(key: string, prefix = ""): string | null {
    const property = this.propertyMap[`${prefix}${key}`];
    if (property) {
      delete this.propertyMap[`${prefix}${key}`];
    }

    return property;
  }

  public clear(): void {
    this.propertyMap = {};
  }
}
