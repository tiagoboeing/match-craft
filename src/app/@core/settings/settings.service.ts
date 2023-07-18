import { Injectable } from '@angular/core'
import { createStore, setProp, withProps } from '@ngneat/elf'

interface SettingsProps {
  table: { generateRounds: boolean }
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public readonly settingsStore = createStore(
    { name: 'settings' },
    withProps<SettingsProps>({
      table: {
        generateRounds: true,
      },
    }),
  )

  setGenerateRounds(generateRounds: boolean): void {
    this.settingsStore.update(setProp('table', { generateRounds }))
  }
}
