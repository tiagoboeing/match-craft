import { Player } from '../../player/models/player.model';

export type Team = Player[];

export type Match = {
  team1: Team;
  team2: Team;
};

export type Round = {
  round: number;
  matches: Match[];
};
