import { Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  players: Player[] = [];

  listChanged = new BehaviorSubject<Player[]>(this.players);
  playerCreated = new Subject<Player>();
  playerRemoved = new Subject<Player>();

  constructor(@Optional() @SkipSelf() parent?: PlayerService) {
    if (parent) {
      throw Error(
        `[PlayerService]: trying to create multiple instances,
        but this service should be a singleton.`
      );
    }
  }

  private getLastId(): number {
    let lastId = 0;

    const clonedList = structuredClone(this.players);

    if (this.players.length > 0) {
      const higherId = clonedList.sort((a, b) => a.id - b.id).pop();

      if (higherId) lastId = higherId.id;
    }

    return lastId;
  }

  create(name: string): Player {
    let lastId = this.getLastId();

    const player: Player = {
      id: lastId + 1,
      name,
      hasPlayedWith: new Set(),
    };

    this.players.push(player);

    this.playerCreated.next(player);
    this.listChanged.next(this.players);

    return player;
  }

  createBulk(...names: string[]): Player[] {
    let lastId = this.getLastId();

    const players = names.map((name) => {
      const player: Player = {
        id: lastId++,
        name,
        hasPlayedWith: new Set(),
      };

      this.playerCreated.next(player);

      return player;
    });

    this.players.push(...players);
    this.listChanged.next(this.players);

    return players;
  }

  remove(id: number) {
    const player = this.players.find((player) => player.id === id);

    if (player) {
      this.players = this.players.filter((player) => player.id !== id);
      this.listChanged.next(this.players);
      this.playerRemoved.next(player);
    }

    return player;
  }

  clear(): void {
    this.players = [];
    this.listChanged.next(this.players);
  }
}
