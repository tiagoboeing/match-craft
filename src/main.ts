import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'

import { isDevMode } from '@angular/core'
import { devTools } from '@ngneat/elf-devtools'

if (isDevMode()) devTools()

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
