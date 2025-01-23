import {PageRoutes} from "../app.routes";

export interface NavItem {
  route: PageRoutes;
  fullWidthName: string;
  iconPath: string;
  isIconSvg: boolean;
  isFullWidthOnly: boolean;
}
