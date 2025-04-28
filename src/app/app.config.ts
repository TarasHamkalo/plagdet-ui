import {ApplicationConfig, provideZoneChangeDetection} from "@angular/core";
import {provideRouter, RouteReuseStrategy} from "@angular/router";

import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {SlovakPaginatorService} from "./services/localization/slovak-paginator.service";
import {NgxMonacoEditorConfig, provideMonacoEditor} from "ngx-monaco-editor-v2";
import {PlagdetRouteReuseStrategy} from "./context/plagdet-route-reuse-strategy";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide: MatPaginatorIntl, useClass: SlovakPaginatorService},
    {provide: RouteReuseStrategy, useClass: PlagdetRouteReuseStrategy},
    provideMonacoEditor(),
    provideAnimationsAsync(),
  ]
};
