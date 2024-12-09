import {Routes} from "../enum/routes";

export interface NavItem {
  route: Routes;
  fullWidthName: string;
  iconPath: string;
  isIconSvg: boolean;
  isFullWidthOnly: boolean;
}
