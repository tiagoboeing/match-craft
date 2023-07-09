import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableService } from './services/table.service'
import { TableComponent } from './table.component'
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule, TranslateModule.forChild()],
  exports: [TableComponent],
  providers: [TableService],
})
export class TableModule {}
