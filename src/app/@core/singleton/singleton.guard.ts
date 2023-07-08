import { Injectable, Optional, SkipSelf } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class GuardedSingletonService {
  constructor(@Optional() @SkipSelf() parent?: GuardedSingletonService) {
    if (parent) {
      throw Error(
        `[GuardedSingletonService]: trying to create multiple instances,
        but this service should be a singleton.`,
      )
    }
  }
}
