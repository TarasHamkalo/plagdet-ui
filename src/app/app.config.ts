import {ApplicationConfig, provideZoneChangeDetection} from "@angular/core";
import {provideRouter, RouteReuseStrategy} from "@angular/router";

import {routes} from "./app.routes";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatPaginatorIntl} from "@angular/material/paginator";
import {SlovakPaginatorService} from "./services/localization/slovak-paginator.service";
import {NgxMonacoEditorConfig, provideMonacoEditor} from "ngx-monaco-editor-v2";
import {PlagdetRouteReuseStrategy} from "./context/plagdet-route-reuse-strategy";

const monacoConfig: NgxMonacoEditorConfig = {
  // baseUrl: 'assets',
  // defaultOptions: {}, // pass default options to be used
  // onMonacoLoad: () => { console.log((<any>window).monaco); } ,// here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
  requireConfig: {
    preferScriptTags: true,
    paths: {
      "vs": "/~th776no/plagdet/assets/monaco/min/vs"
    }
  }, // allows to oweride configuration passed to monacos loader
  monacoRequire: (window as any).monacoRequire // pass here monacos require function if you loaded monacos loader (loader.js) yourself
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide: MatPaginatorIntl, useClass: SlovakPaginatorService},
    {provide: RouteReuseStrategy, useClass: PlagdetRouteReuseStrategy},
    provideMonacoEditor(monacoConfig),
    provideAnimationsAsync(),
  ]
};
