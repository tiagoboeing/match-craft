import { Component, Input, OnInit } from '@angular/core';
import { TableService } from './services/table.service';
import { PlayerService } from '../player/services/player.service';
import { Match } from './models/table.model';
import { Player } from '../player/models/player.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input()
  players: Player[] = [];

  matches: Match[] = [];

  constructor(
    private tableService: TableService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    // this.playerService.listChanged.subscribe((players) => {
    //   if (players?.length)
    //     this.matches = this.tableService.createMatches(players);
    // });
  }

  create(): void {
    this.matches = this.tableService.createMatches(this.players);
  }
}
