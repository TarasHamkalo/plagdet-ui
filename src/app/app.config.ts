import {ApplicationConfig, provideZoneChangeDetection} from "@angular/core";
import {provideRouter} from "@angular/router";

import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {SlovakPaginatorService} from "./services/localization/slovak-paginator.service";
import {provideMonacoEditor} from "ngx-monaco-editor-v2";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide: MatPaginatorIntl, useClass: SlovakPaginatorService},
    provideMonacoEditor(),
  ]
};
