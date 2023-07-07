export interface Player {
  id: number
  name: string
  hasPlayedWith: Set<string>
}

export type Team = Player[]

export type Match = {
  team1: Team
  team2: Team
}

export type Round = {
  round: number
  matches: Match[]
}
