import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableService } from './services/table.service'
import { TableComponent } from './table.component'

@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule],
  exports: [TableComponent],
  providers: [TableService],
})
export class TableModule {}
