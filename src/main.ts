import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {environment} from './environments/environment';
import {DemoModule} from "./demo/demo.module";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DemoModule);
