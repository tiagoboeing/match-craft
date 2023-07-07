import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PlayerComponent } from './player.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PlayerComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [PlayerComponent],
  providers: [],
})
export class PlayerModule {}
