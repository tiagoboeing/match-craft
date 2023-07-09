import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.initLanguage()
  }

  initLanguage(): void {
    this.translate.setDefaultLang('pt-BR')

    const browserLang = this.translate.getBrowserCultureLang()

    if (browserLang) {
      this.translate.use(browserLang)
    }
  }

  changeLanguage(language: string): void {
    this.translate.use(language)
  }
}
