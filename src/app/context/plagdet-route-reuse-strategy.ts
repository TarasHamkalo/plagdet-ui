import {RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from "@angular/router";

export class PlagdetRouteReuseStrategy implements RouteReuseStrategy {
  protected storedRouteHandles = new Map<string, DetachedRouteHandle>();

  protected allowRetrieveCache: Record<string, boolean> = {
    "graph": true,
    "heatmap": false,
    "metadata": true,
    "analysis": true,
    "diff": true,
  };

  private getBaseRoute(route: ActivatedRouteSnapshot): string | undefined {
    return route.routeConfig?.path?.split("/")[0];
  }

  public shouldReuseRoute(before: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return before.routeConfig === curr.routeConfig;
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const basePath = this.getBaseRoute(route);
    return basePath && this.allowRetrieveCache[basePath] ? this.storedRouteHandles.get(basePath) || null : null;
  }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const basePath = this.getBaseRoute(route);
    console.log(`Checking attach for: ${basePath}`);
    return basePath ? this.allowRetrieveCache[basePath] && this.storedRouteHandles.has(basePath) : false;
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const basePath = this.getBaseRoute(route);
    return basePath ? this.allowRetrieveCache[basePath] : false;
  }

  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    const basePath = this.getBaseRoute(route);
    if (basePath && this.allowRetrieveCache[basePath]) {
      console.log(`Storing route: ${basePath}`);
      this.storedRouteHandles.set(basePath, detachedTree);
    }
  }
}
