import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerModule } from './features/player/player.module';
import { TableModule } from './features/table/table.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PlayerModule, TableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
