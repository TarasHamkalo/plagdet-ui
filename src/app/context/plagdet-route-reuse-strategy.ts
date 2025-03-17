import {RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from "@angular/router";

export class PlagdetRouteReuseStrategy implements RouteReuseStrategy {
  protected storedRouteHandles = new Map<string, DetachedRouteHandle>();

  protected allowRetrieveCache = new Map<string, boolean>([
    ["graph", true],
    ["heatmap", false],
    ["diff", true]
  ]);

  private getBaseRoute(route: ActivatedRouteSnapshot): string | undefined {
    console.log("Route path:", route.routeConfig?.path);
    return route.routeConfig?.path?.split("/")[0];
  }

  public shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return before.routeConfig === curr.routeConfig;
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const basePath = this.getBaseRoute(route);
    console.log(`Retrieve attach for: ${basePath}`);
    return basePath && this.allowRetrieveCache.get(basePath) ? this.storedRouteHandles.get(basePath) || null : null;
  }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const basePath = this.getBaseRoute(route);
    console.log(`Checking attach for: ${basePath}`);
    if (basePath) {
      const cacheAllowed = this.allowRetrieveCache.get(basePath!);
      return (cacheAllowed !== undefined && cacheAllowed) && this.storedRouteHandles.has(basePath);
    }

    return false;
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const basePath = this.getBaseRoute(route);
    if (basePath) {
      const cacheAllowed = this.allowRetrieveCache.get(basePath);
      return cacheAllowed != undefined && cacheAllowed;
    }

    return false;
  }

  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    const basePath = this.getBaseRoute(route);
    if (basePath) {
      const cacheAllowed = this.allowRetrieveCache.get(basePath);
      if (cacheAllowed != undefined && cacheAllowed) {
        console.log(`Storing route: ${basePath}`);
        this.storedRouteHandles.set(basePath, detachedTree);
      }
    }
  }
}
