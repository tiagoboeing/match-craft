import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { TableModule } from '../table/table.module'
import { PlayerComponent } from './player.component'
import { TranslateModule } from '@ngx-translate/core'

const routes: Routes = [
  {
    path: '',
    component: PlayerComponent,
  },
]

@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TableModule,
    TranslateModule.forChild(),
  ],
  exports: [PlayerComponent],
  providers: [],
})
export class PlayerModule {}
