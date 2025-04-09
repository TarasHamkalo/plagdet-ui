import {RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from "@angular/router";
import {PageRoutes} from "../app.routes";

export class PlagdetRouteReuseStrategy implements RouteReuseStrategy {
  protected storedRouteHandles = new Map<string, DetachedRouteHandle>();

  protected allowRetrieveCache = new Map<string, boolean>([
    ["graph", true],
    ["diff", true],
    ["pairs", true]
  ]);

  // private getBasePath(route: ActivatedRouteSnapshot): string | undefined {
  //   return route.routeConfig?.path?.split("/")[0];
  // }

  private getBasePath(path: string): string {
    return path.split("/").pop()!;
  }

  public shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return before.routeConfig === curr.routeConfig;
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig?.path;
    if (path && this.allowRetrieveCache.get(this.getBasePath(path))) {
      const route = this.storedRouteHandles.get(path);
      return route ? route : null;
    }

    return null;
  }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path;
    if (path && this.allowRetrieveCache.get(this.getBasePath(path))) {
      return this.storedRouteHandles.has(path);
    }

    return false;
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path;
    if (path) {
      const basePath = this.getBasePath(path);
      if (basePath === PageRoutes.HOME.substring(1)) {
        this.storedRouteHandles.clear();
        return false;
      }

      if (basePath) {
        const cacheAllowed = this.allowRetrieveCache.get(basePath);
        return cacheAllowed != undefined && cacheAllowed;
      }
    }


    return false;
  }

  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    const path = route.routeConfig?.path;
    if (path && this.allowRetrieveCache.get(this.getBasePath(path))) {
      this.storedRouteHandles.set(path, detachedTree);
    }
  }
}
